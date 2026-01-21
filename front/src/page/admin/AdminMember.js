import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  SearchInput,
  SearchButton,
} from "../../component/FormFrm";
import Pagination from "../../component/Pagination";
import "./admin.css";


const AdminMember = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;

  // 현재 로그인한 회원 정보
  const [currentMember, setCurrentMember] = useState({});

  // 회원 목록 state
  const [members, setMembers] = useState([]);

  // 페이지네이션
  const [pageInfo, setPageInfo] = useState(null);
  const [reqPage, setReqPage] = useState(1);

  // 검색 관련 state
  const [searchType, setSearchType] = useState("member_id"); // "member_id", "member_nickname", "both"
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  // 현재 로그인한 회원 정보 조회
  useEffect(() => {
    axios
      .get(backServer + "/member")
      .then((res) => {
        if (res.data.message === "success") {
          setCurrentMember(res.data.data);
        }
      })
      .catch((err) => {
        console.error("회원 정보 조회 실패:", err);
      });
  }, [backServer]);

  // 회원 목록 조회
  useEffect(() => {
    let url = backServer + "/admin/member/list/" + reqPage;

    // 검색 모드일 때
    if (searchMode && searchParams) {
      url = backServer + "/admin/member/search";
      url += "?searchType=" + searchParams.searchType;
      url += "&keyword=" + encodeURIComponent(searchParams.keyword);
      url += "&reqPage=" + reqPage;
    }

    axios
      .get(url)
      .then((res) => {
        if (res.data.message === "success") {
          console.log("회원 목록:", res.data.data);
          const memberList = res.data.data.memberList || [];
          setMembers(memberList);
          setPageInfo(res.data.data.pi);
        }
      })
      .catch((err) => {
        console.error("회원 목록 조회 실패:", err);
      });
  }, [reqPage, searchMode, searchParams, backServer]);

  // 검색 타입 변경 시 검색어 초기화
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchKeyword("");
  };

  // 검색 실행
  const handleSearch = () => {
    // 검색어가 없으면 검색 모드 해제
    if (searchKeyword.trim() === "") {
      setSearchMode(false);
      setSearchParams(null);
      setReqPage(1);
      return;
    }

    // 검색 모드 활성화
    setSearchMode(true);
    setSearchParams({
      searchType,
      keyword: searchKeyword,
    });
    setReqPage(1); // 검색 시 첫 페이지로
  };

  // 검색 초기화
  const handleResetSearch = () => {
    setSearchMode(false);
    setSearchParams(null);
    setSearchKeyword("");
    setReqPage(1);
  };




  return (
    <div className="admin-member-wrap">
      {/* 헤더 */}
      <div className="admin-member-header">
        <h2 className="admin-member-title">회원 관리</h2>
        <p className="admin-member-subtitle">
          전체 회원을 조회하고 관리할 수 있습니다.
        </p>
      </div>

      {/* 검색 영역 */}
      <div className="admin-member-search">
        <div className="admin-member-search-container">
          <div className="search-type-select">
            <select
              className="search-type-select-input"
              value={searchType}
              onChange={handleSearchTypeChange}
            >
              <option value="member_id">아이디</option>
              <option value="member_nickname">닉네임</option>
              <option value="both">아이디+닉네임</option>
            </select>
          </div>

          <div className="search-input-area">
            <SearchInput
              data={searchKeyword}
              setData={setSearchKeyword}
              placeholder="검색어를 입력하세요"
              onSearch={handleSearch}
            />
          </div>

          <div className="search-button-area">
            <SearchButton text="검색" onClick={handleSearch} />
            {searchMode && (
              <SearchButton
                text="초기화"
                onClick={handleResetSearch}
                className="search-reset-btn"
              />
            )}
          </div>
        </div>
      </div>

      {/* 회원 리스트 */}
      <div className="admin-member-list">
        {members.length === 0 ? (
          <div className="no-members-message">
            {searchMode
              ? "검색 결과가 없습니다."
              : "등록된 회원이 없습니다."}
          </div>
        ) : (
          <table className="admin-member-table">
            <thead>
              <tr>
                <th>아이디</th>
                <th>닉네임</th>
                <th>이메일</th>
                <th>전화번호</th>
                <th>회원 유형</th>
                <th>가입일</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <AdminMemberItem
                  key={member.memberId || index}
                  member={member}
                  setMembers={setMembers}
                  currentMemberId={currentMember.memberId}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 페이지네이션 */}
      {pageInfo && (
        <div className="admin-member-pagination">
          <Pagination
            pageInfo={pageInfo}
            reqPage={reqPage}
            setReqPage={setReqPage}
          />
        </div>
      )}
    </div>
  );
};

// 회원 아이템 컴포넌트
const AdminMemberItem = ({ member, setMembers, currentMemberId }) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberType, setMemberType] = useState(member.memberType);
    
  useEffect(() => {
    setMemberType(member.memberType);
  }, [member.memberType]);

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // 전화번호 포맷팅
  const formatPhone = (phone) => {
    if (!phone) return "-";
    // 01012345678 -> 010-1234-5678
    if (phone.length === 11) {
      return phone.substring(0, 3) + "-" + phone.substring(3, 7) + "-" + phone.substring(7);
    }
    return phone;
  };




  const changeType = (e) => {
    // admin 회원은 변경 불가
    if (member.memberId === "admin") {
      Swal.fire({
        title: "변경 불가",
        text: "관리자 계정은 등급을 변경할 수 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#1a1a1a",
      });
      return;
    }

    const newMemberType = parseInt(e.target.value);
    const m = { memberId: member.memberId, memberType: newMemberType };

    axios
      .patch(backServer + "/admin/member/type", m)
      .then((res) => {
        if (res.data.message === "success") {
          setMemberType(newMemberType);
          Swal.fire({
            title: "회원 등급이 변경되었습니다.",
            icon: "success",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          });
        } else {
          Swal.fire({
            title: "변경 실패",
            text: "회원 등급 변경에 실패했습니다.",
            icon: "error",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          });
          // 실패 시 원래 값으로 되돌리기
          setMemberType(member.memberType);
        }
      })
      .catch((err) => {
        console.error("회원 등급 변경 실패:", err);
        Swal.fire({
          title: "변경 실패",
          text: "서버 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#1a1a1a",
        });
        // 실패 시 원래 값으로 되돌리기
        setMemberType(member.memberType);
      });
  };

  // 회원 삭제
  const deleteMember = () => {
    // admin 회원은 삭제 불가
    if (member.memberId === "admin") {
      Swal.fire({
        title: "삭제 불가",
        text: "관리자 계정은 삭제할 수 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#1a1a1a",
      });
      return;
    }

    // 자기 자신은 삭제 불가
    if (member.memberId === currentMemberId) {
      Swal.fire({
        title: "삭제 불가",
        text: "자기 자신은 삭제할 수 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#1a1a1a",
      });
      return;
    }

    Swal.fire({
      title: "회원 삭제",
      text: `정말로 ${member.memberId} 회원을 삭제하시겠습니까?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(backServer + "/admin/member/" + member.memberId)
          .then((res) => {
            if (res.data.message === "success") {
              Swal.fire({
                title: "삭제 완료",
                text: "회원이 삭제되었습니다.",
                icon: "success",
                confirmButtonText: "확인",
                confirmButtonColor: "#1a1a1a",
              });
              // 목록에서 제거
              setMembers((prevMembers) =>
                prevMembers.filter((m) => m.memberId !== member.memberId)
              );
            } else {
              Swal.fire({
                title: "삭제 실패",
                text: "회원 삭제에 실패했습니다.",
                icon: "error",
                confirmButtonText: "확인",
                confirmButtonColor: "#1a1a1a",
              });
            }
          })
          .catch((err) => {
            console.error("회원 삭제 실패:", err);
            Swal.fire({
              title: "삭제 실패",
              text: "서버 오류가 발생했습니다.",
              icon: "error",
              confirmButtonText: "확인",
              confirmButtonColor: "#1a1a1a",
            });
          });
      }
    });
  };

  return (
    <tr>
      <td>{member.memberId || "-"}</td>
      <td>{member.memberNickname || "-"}</td>
      <td>{member.memberEmail || "-"}</td>
      <td>{formatPhone(member.memberPhone)}</td>
      <td>
        <select
          value={memberType}
          onChange={changeType}
          disabled={member.memberId === "admin"}
          className="member-type-select"
        >
          <option value={1}>관리자</option>
          <option value={2}>일반회원</option>
          <option value={3}>정지회원</option>
        </select>
      </td>
      <td>{formatDate(member.memberEnrollDate)}</td>
      <td>
        <button
          onClick={deleteMember}
          disabled={member.memberId === "admin" || member.memberId === currentMemberId}
          className="member-delete-btn"
        >
          삭제
        </button>
      </td>
    </tr>
  );
};


export default AdminMember;
