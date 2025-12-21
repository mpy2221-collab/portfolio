import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const MemberMain = (props) => {
    const isLogin = props.isLogin;
    const navigate = useNavigate();
    
    if(!isLogin){
        Swal.fire({
            title: "로그인 필요한 서비스입니다.",
            text: "로그인 후 이용해주세요.",
            icon: "warning",
            confirmButtonText: "확인"
        }).then(() => {
            navigate("/login");
        });
    }

    return(
        <div>
            <h1>여기는 마이페이지</h1>
        </div>
    )
}

export default MemberMain;