import { useState, useEffect } from 'react'
import { useNavigate } from "react-router";
import { useAuth } from '@hooks/AuthProvider.jsx'
import { api, formApi } from '@utils/network.js'

const UserEdit = () => {
  const [no, setNo] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState(true)
  const [role, setRole] = useState(false)
  

  const imgUpload = (file) => {
	const formData = new FormData();
	 formData.append("files", file)
  	formData.append("txt", "profile")

	formApi.post("/upload", formData)
	.then (res=>console.log(res.data))
    .catch(err=>console.error(err.response.data))
  }



function imgEvent() {
      const img = document.getElementById("preview");
      const x = document.createElement("input");
      x.type = "file";
      x.accept = "image/*";
	  x.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            img.src = e.target.result;
			imgUpload(file)
          };
          reader.readAsDataURL(file);
        }
      });

      x.click();
    }


  const { checkAuth } = useAuth()
  const navigate = useNavigate()

  const submitEvent = e => {
	e.preventDefault()
	const params = { email }
	api.patch("/user", params)
	.then(res=>{
	  alert(res.data.message)
	  if(res.data.status) navigate("/userview")
	})
	.catch(err => console.error(err))
  }

  const setData = data => {
	setNo(data.no)
	setName(data.name)
	setEmail(data.email)
	setGender(data.gender)
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
	<div className="container mt-3">
			<h1 className="display-1 text-center">회원수정</h1>
			<div className="d-flex justify-content-center">
				<img className="d-block rounded-circle img-thumbnail mt-3 border user_pt" src="/img_01.jpg" alt="logo" id="preview" onClick={imgEvent} />
      		</div>
			<form onSubmit={submitEvent}>
				<div className="mb-3 mt-3">
					<label htmlFor="name" className="form-label">이름</label>
					<input type="text" className="form-control" id="name" name="name" readOnly="readonly" defaultValue={name} />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="email" className="form-label">이메일</label>
					<input type="email" className="form-control" id="email" name="email" value={email} onChange={e=>setEmail(e.target.value)}  autoComplete='off' required={true} />
				</div>
				<div className="d-flex">
					<div className="p-2 flex-fill">
						<div className="form-check">
							<input type="radio" className="form-check-input" id="radio1" name="gender" value="1" checked={gender} onChange={()=>setGender(true)} />남성
							<label className="form-check-label" htmlFor="radio1"></label>
						</div>
					</div>
					<div className="p-2 flex-fill">
						<div className="form-check">
							<input type="radio" className="form-check-input" id="radio2" name="gender" value="2" checked={!gender} onChange={()=>setGender(false)} />여성
							<label className="form-check-label" htmlFor="radio2"></label>
						</div>
					</div>
				</div>
		<div className="d-flex">
		  {role &&
			<div className="p-2 flex-fill d-grid">
			  <button type="submit" className="btn btn-primary">저장</button>
			</div>
		  }
		  <div className="p-2 flex-fill d-grid">
			<button type="button" className="btn btn-primary" onClick={()=>navigate("/userview")}>취소</button>
		  </div>
		</div>
			</form>
		</div>
  )
}

export default UserEdit