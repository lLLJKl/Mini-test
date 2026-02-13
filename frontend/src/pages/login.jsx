import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from '@/hooks/Authprovider.jsx';
import { api } from '@/utils/network.js';

const Login = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();


  // 1. sendMail: 메일로 인증코드를 발송하는 이벤트 함수로 react에서 bakend1:home.py - login 엔드포인트에게 email을 담아 메일 발송 요청을 함  
  // 2. backend1: home.py - login 엔드포인트는 kafka로 producer입장에서 해당 topic에 email 정보를 consumer에게 보낸다
  // 3. backend2: consumer입장에서 kafaka topic에 있는 email 정보를 redis를 이용하여 id:email 형식으로 형식으로 관리하기위해 코드 6자리(id) 생성후 저장
  // 4. backend2: main.py - on_event 엔드포인트를 통해 메일로 해당 id(인증코드) 발송
  const sendMail = (e) => {
    e.preventDefault();
    api
      .post("login", { email })
      .then((res) => {
        if (res.data.status) alert("메일 발송 요청 완료");
        else alert("메일 발송 실패");
      })
      .catch((err) => {
        console.error(err);
        alert("오류");
      });
  };

  // verify: 인증 코드 확인 버튼이 실행되었을 때, 최종 로그인이 되는 이벤트함수입니다.
  // 1. backend1: home.py - /code 엔드포인트를 통해 id(인증코드)를 해석 요청하여 db에 해당 계정이 있는지 확인하여 로그인 후 home 화면으로 이동합니다.
  // cf) code 해석후 backend1(home.py - code/)에서는 토큰을 생성하여 리턴값을 status 및 mini.login에 (uuid:토큰)형식으로 정보가 담긴 uuid를 담은 쿠키를 반환합니다. 
  // (요약: 돌아오는 응답 값 = status, 토큰의 식별 uuid코드가 담긴 쿠키)

  const verify = (e) => {
    e.preventDefault();
    api
      .post("/code", { id: code }, 
      { withCredentials: true })
      .then(async (res) => {
        if (res.data.status) {
          alert("인증 성공");
          await refreshAuth();     //여기서 즉시 로그인 상태 갱신(await: refeshAuth 함수가 실행이 되고 아래 코드 실행, 
                                   //이게 없으면 로그인 상태갱신 전에 navigate("/")이 실행되어 nav바에 로그인 상태가 변환이 안됨)
          navigate("/");
        } else {
          alert("인증 실패");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("오류");
      });
  };

  return (
    <div className="container mt-3 box_size">
      <h1 className="display-1 text-center">로그인</h1>

      <form onSubmit={sendMail}>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">이메일</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="이메일를 입력하세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="d-flex mb-4">
          <div className="p-2 flex-fill d-grid">
            <button type="submit" className="btn btn-primary">메일 발송</button>
          </div>
          <div className="p-2 flex-fill d-grid">
            <button type="button" className="btn btn-primary" onClick={() => setEmail("")}>
              취소
            </button>
          </div>
        </div>
      </form>

      <form onSubmit={verify}>
        <div className="mb-3 d-flex">
          <input
            type="text"
            className="form-control"
            id="code"
            placeholder="인증번호를 입력하세요"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" className="w-25 btn btn-primary">인증</button>
        </div>
      </form>
    </div>
  );
};

export default Login;