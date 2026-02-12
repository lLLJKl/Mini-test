import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(true);

  const navigate = useNavigate();
  
  const check = (e) => {
    e.preventDefault();

    if (!email || !name) {
      alert("정보를 입력하세요");
      return;
    }

    axios
      .get("http://localhost:8001/check_email", { params: { email } })
      .then((res) => {
        if (res.data.status === "duplicate") 
            alert("이미 사용중인 이메일");
        else if (res.data.status === "ok") 
            alert("사용 가능한 이메일");
        else alert("응답 이상");
      })
      .catch((err) => {
        console.error(err);
        alert("오류 발생");
      });
  };

  const submit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8001/signup", {params})
      .then((res) => {
        if (res.data.status) 
            alert(`${name}님 가입을 축하합니다!`);
        else{res.data.status}
            alert("가입 실패, 중복 확인이 필요합니다");
      })
      .catch((err) => {
        console.error(err);
        alert("오류 발생");
    });

  };


  const back = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
        <>
            <div className="container mt-3 box_size" >
                <h1 className="display-1 text-center">회원가입</h1>

                <form onSubmit={submit}>
                    <div className="mb-3 mt-3">
                        <label htmlFor="name" className="form-label">이름:</label>
                        <input type="text" className="form-control" id="name" placeholder="이름을 입력하세요." name="name" value={name} onChange={e=>setName(e.target.value)} />
                    </div>
                    <div className="mb-3 mt-3">
                        <label htmlFor="email" className="form-label">이메일:</label>
                        <div className="d-flex">
                        <input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요." name="email" value={email} onChange={e=>setEmail(e.target.value)}/>
                        <button type="button" onClick={check} className="btn btn-primary email_btn">중복 확인</button>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="p-2 flex-fill">
                            <div className="form-check">
                                <input type="radio" className="form-check-input" id="radio1" name="gender" value="1" checked={gender === true} onChange={()=>setGender(True)}/>남성
                                <label className="form-check-label" htmlFor="radio1"></label>
                            </div>
                        </div>
                        <div className="p-2 flex-fill">
                            <div className="form-check">
                                <input type="radio" className="form-check-input" id="radio2" name="gender" value="2" checked={gender === false} onChange={()=>setGender(false)}/>여성
                                <label className="form-check-label" htmlFor="radio2"></label>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex">
                        <div className="p-2 flex-fill d-grid">
                            <button type="submit" className="btn btn-primary">가입</button>
                        </div>
                        <div className="p-2 flex-fill d-grid">
                            <button type="button" onClick={back} className="btn btn-primary">취소</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
  );
};

export default Signup;