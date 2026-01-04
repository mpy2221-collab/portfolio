import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./comment.css";

const Comment = (props) => {
  const commentType = props.commentType;
  const targetNo = props.targetNo;
  const isLogin = props.isLogin;
  const memberId = props.memberId;
  const backServer = props.backServer;

  // State 관리
  const [comments, setComments] = useState([]);
  const [editingCommentNo, setEditingCommentNo] = useState(null);
  const [replyingToCommentNo, setReplyingToCommentNo] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [newReplyContent, setNewReplyContent] = useState("");
  const [editCommentContent, setEditCommentContent] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 프로필 이미지 URL 생성
  const getProfileUrl = (profileImg) => {
    if (!profileImg) return "/image/default.png";
    return backServer + "/member/profile/" + profileImg;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    if (typeof dateString === "string" && dateString.includes("T")) {
      return dateString.split("T")[0];
    }
    return dateString;
  };

  // commentList와 reCommentList를 결합하여 부모-자식 구조로 변환
  const combineComments = (commentList, reCommentList) => {
    return commentList.map((comment) => {
      const replies = reCommentList.filter(
        (reply) => reply.commentParentNo === comment.commentNo
      );
      return {
        ...comment,
        replies: replies,
      };
    });
  };

  // 댓글 목록 조회
  useEffect(() => {
    axios
      .get(backServer + "/comment/list/" + commentType + "/" + targetNo)
      .then((res) => {
        if (res.data.message === "success") {
          const data = res.data.data;
          console.log(data);
          const commentList = data.commentList;
          const reCommentList = data.reCommentList;
          const combined = combineComments(commentList, reCommentList);
          setComments(combined);
        }
      })
      .catch((err) => {
        console.error("댓글 조회 실패:", err);
      });
  }, [commentType, targetNo, backServer, refreshTrigger]);

  // 댓글 작성
  const handleWriteComment = () => {
    if (!newCommentContent.trim()) {
      Swal.fire({
        title: "알림",
        text: "댓글 내용을 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    axios
      .post(backServer + "/comment/write", {
        commentType: commentType,
        commentBoardNo: commentType === "board" ? targetNo : null,
        commentUserpickNo: commentType === "userpick" ? targetNo : null,
        commentContent: newCommentContent,
        commentParentNo: null,
      })
      .then((res) => {
        if (res.data.message === "success") {
          setRefreshTrigger((prev) => prev + 1);
          setNewCommentContent("");
          Swal.fire({
            title: "성공",
            text: "댓글이 작성되었습니다.",
            icon: "success",
            confirmButtonText: "확인",
          });
        }
      })
      .catch((err) => {
        console.error("댓글 작성 실패:", err);
        Swal.fire({
          title: "오류",
          text: "댓글 작성 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  // 대댓글 작성
  const handleWriteReply = (parentCommentNo) => {
    if (!newReplyContent.trim()) {
      Swal.fire({
        title: "알림",
        text: "대댓글 내용을 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    axios
      .post(backServer + "/comment/write", {
        commentType: commentType,
        commentBoardNo: commentType === "board" ? targetNo : null,
        commentUserpickNo: commentType === "userpick" ? targetNo : null,
        commentContent: newReplyContent,
        commentParentNo: parentCommentNo,
      })
      .then((res) => {
        if (res.data.message === "success") {
          setRefreshTrigger((prev) => prev + 1);
          setNewReplyContent("");
          setReplyingToCommentNo(null);
        }
      })
      .catch((err) => {
        console.error("대댓글 작성 실패:", err);
        Swal.fire({
          title: "오류",
          text: "대댓글 작성 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  // 댓글 수정 시작
  const handleEditClick = (comment) => {
    setEditingCommentNo(comment.commentNo);
    setEditCommentContent(comment.commentContent);
  };

  // 댓글 수정 완료
  const handleUpdateComment = (commentNo) => {
    if (!editCommentContent.trim()) {
      Swal.fire({
        title: "알림",
        text: "댓글 내용을 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    axios
      .put(backServer + "/comment",{
        commentNo: commentNo,
        commentContent: editCommentContent,
      })
      .then((res) => {
        if (res.data.message === "success") {
          setRefreshTrigger((prev) => prev + 1);
          setEditingCommentNo(null);
          setEditCommentContent("");
        }
      })
      .catch((err) => {
        console.error("댓글 수정 실패:", err);
        Swal.fire({
          title: "오류",
          text: "댓글 수정 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  // 댓글 삭제
  const handleDeleteComment = (commentNo) => {
    Swal.fire({
      title: "댓글 삭제",
      text: "정말 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(backServer + "/comment/" + commentNo)
          .then((res) => {
            if (res.data.message === "success") {
              setRefreshTrigger((prev) => prev + 1);
              Swal.fire({
                title: "삭제 완료",
                text: "댓글이 삭제되었습니다.",
                icon: "success",
                confirmButtonText: "확인",
              });
            }
          })
          .catch((err) => {
            console.error("댓글 삭제 실패:", err);
            Swal.fire({
              title: "오류",
              text: "댓글 삭제 중 오류가 발생했습니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
          });
      }
    });
  };

  // 댓글 아이템 렌더링
  const renderCommentItem = (comment, isReply = false) => {
    // 작성자 본인 여부 확인
    // 서버에서 commentMemberId도 함께 보내주어야 정확한 비교 가능
    // 현재는 commentMemberId가 있으면 사용하고, 없으면 false로 처리
    const isAuthor =
      comment.commentMemberId && comment.commentMemberId === memberId;

    return (
      <div
        key={comment.commentNo}
        className={isReply ? "reply-item" : "comment-item"}
      >
        {/* 프로필 이미지, 닉네임, 작성일 */}
        <div className="comment-header">
          <img
            src={getProfileUrl(comment.commentMemberProfileImg)}
            alt={comment.commentMemberNickname}
            className="comment-profile-img"
          />
          <div className="comment-author-info">
            <span className="comment-author">
              {comment.commentMemberNickname}
            </span>
            <span className="comment-date">
              {formatDate(comment.commentDate)}
            </span>
          </div>
        </div>

        {/* 댓글 내용 */}
        <div className="comment-content">
          {editingCommentNo === comment.commentNo ? (
            // 수정 모드
            <div className="comment-edit-form">
              <textarea
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
                className="comment-edit-textarea"
                rows="3"
              />
              <div className="comment-edit-buttons">
                <button
                  onClick={() => handleUpdateComment(comment.commentNo)}
                  className="comment-edit-submit-btn"
                >
                  수정완료
                </button>
                <button
                  onClick={() => {
                    setEditingCommentNo(null);
                    setEditCommentContent("");
                  }}
                  className="comment-edit-cancel-btn"
                >
                  수정취소
                </button>
              </div>
            </div>
          ) : (
            <p className="comment-text">{comment.commentContent}</p>
          )}
        </div>

        {/* 수정/삭제/답글 버튼 */}
        <div className="comment-actions">
          {/* 수정/삭제 버튼 (작성자 본인만) */}
          {isAuthor && editingCommentNo !== comment.commentNo && (
            <>
              <button
                onClick={() => handleEditClick(comment)}
                className="comment-edit-btn"
              >
                수정
              </button>
              <button
                onClick={() => handleDeleteComment(comment.commentNo)}
                className="comment-delete-btn"
              >
                삭제
              </button>
            </>
          )}

          {/* 답글 버튼 (대댓글이 아닌 경우만, 로그인한 경우만, 대댓글 작성 폼이 열려있지 않을 때만) */}
          {!isReply &&
            isLogin &&
            editingCommentNo !== comment.commentNo &&
            replyingToCommentNo !== comment.commentNo && (
              <button
                onClick={() => {
                  setReplyingToCommentNo(comment.commentNo);
                  setNewReplyContent("");
                }}
                className="comment-reply-btn"
              >
                답글
              </button>
            )}
        </div>

        {/* 대댓글 작성 폼 */}
        {replyingToCommentNo === comment.commentNo && (
          <div className="reply-form">
            <textarea
              value={newReplyContent}
              onChange={(e) => setNewReplyContent(e.target.value)}
              placeholder="대댓글을 입력하세요"
              className="reply-textarea"
              rows="3"
            />
            <div className="reply-form-buttons">
              <button
                onClick={() => handleWriteReply(comment.commentNo)}
                className="reply-submit-btn"
              >
                작성
              </button>
              <button
                onClick={() => {
                  setReplyingToCommentNo(null);
                  setNewReplyContent("");
                }}
                className="reply-cancel-btn"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 대댓글 목록 (재귀적 렌더링) */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies-container">
            {comment.replies.map((reply) => renderCommentItem(reply, true))}
          </div>
        )}
      </div>
    );
  };

  // 전체 댓글 수 계산 (부모 댓글 + 대댓글)
  const getTotalCommentCount = () => {
    const parentCount = comments.length;
    const replyCount = comments.reduce((total, comment) => {
      return total + (comment.replies ? comment.replies.length : 0);
    }, 0);
    return parentCount + replyCount;
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section-title">댓글 ({getTotalCommentCount()})</h3>

      {/* 댓글 작성 폼 */}
      {isLogin && (
        <div className="comment-form">
          <textarea
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="comment-textarea"
            rows="3"
          />
          <button
            onClick={handleWriteComment}
            className="comment-submit-btn"
            disabled={!newCommentContent.trim()}
          >
            작성
          </button>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map((comment) => renderCommentItem(comment))
        ) : (
          <div className="no-comments">
            <p>댓글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
