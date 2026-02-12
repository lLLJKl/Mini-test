import { useState, useEffect } from 'react'
import { useNavigate } from "react-router";
import { useAuth } from '@hooks/AuthProvider.jsx'
import { api } from '@utils/network.js'


const UserView =() =>{
	const [name, setName] = useState("")
  	const [email, setEmail] = useState("")
  	const [gender, setGender] = useState(true)
  	const [regDate, setRegDate] = useState("")
  	const [modDate, setModDate] = useState("")
  	const {clearAuth, checkAuth } = useAuth()
  	const navigate = useNavigate()

	const delete_event = () => {
    api.delete("/user")
    .then(res=>{
      alert(res.data.message)
      if(res.data.status) clearAuth()
    })
    .catch(err => console.error(err))
  	}

	const setData = data => {
    setName(data.name)
    setEmail(data.email)
    setGender(data.gender)
    setRegDate(data.regDate)
    setModDate(data.modDate)
  }

  	useEffect(()=>{
    if(!checkAuth()) navigate("/")
    api.post("/user")
    .then(res=>{
      if(res.data.status) {
        setData(res.data.result)
        setRole(res.data.role)
      } else {
        alert(res.data.message);
        navigate("/");
      }
    })
    .catch(err => console.error(err))
  	}, [])
    
  
    return (
    <>
    <div className="container mt-3 position-relative">
		<h1 className="display-1 text-center">회원정보</h1>
		<div>
			<img src="../img01.jpg" className="border user_pt"/>
			
    </div>
		<form>
				<div className="mb-3 mt-3">
					<label htmlFor="name" className="form-label">이름</label>
					<input type="text" className="form-control" id="name" name="name" readOnly="readonly" defaultValue={name}/>
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="email" className="form-label">이메일</label>
					<input type="email" className="form-control" id="email" name="email" readOnly="readonly" defaultValue={email} />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="regDate" className="form-label">가입일</label>
					<input type="text" className="form-control" id="regDate" name="regDate" readOnly="readonly" defaultValue={regDate} />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="modDate" className="form-label">회원정보 수정일</label>
					<input type="text" className="form-control" id="modDate" name="modDate" readOnly="readonly" defaultValue={modDate}/>
				</div>

				<div className="d-flex">
					<div className="p-2 flex-fill">
						<div className="form-check">
							<input type="radio" className="form-check-input" id="radio1" name="gender" value="1" checked={gender}
								disabled/>남성
							<label className="form-check-label" htmlFor="radio1"></label>
						</div>
					</div>
					<div className="p-2 flex-fill">
						<div className="form-check">
							<input type="radio" className="form-check-input" id="radio2" name="gender" value="2" checked={!gender} disabled/>여성
							<label className="form-check-label" htmlFor="radio2"></label>
						</div>
					</div>
				</div>
		</form>
		<div className="d-flex">
			<div className="p-2 flex-fill d-grid">
				<button type="button" className="btn btn-primary"onClick={()=>navigate("/")}>취소</button>
			</div>
			<div className="p-2 flex-fill d-grid">
				<button type="button" className="btn btn-primary"onClick={()=>navigate("/user_edit")}>수정</button>
			</div>
			<div className="p-2 flex-fill d-grid">
				<button type="button" className="btn btn-primary" onClick={delete_event}>탈퇴</button>
			</div>
		</div>
	</div>
    </>
    )
}
export default UserView