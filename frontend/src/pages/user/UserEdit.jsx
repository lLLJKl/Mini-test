import { useState, useEffect,useRef} from 'react'
import { useNavigate } from "react-router";
import { useAuth } from '@hooks/AuthProvider.jsx'
import { api } from '@utils/network.js'

const UserEdit =() =>{
	const [no, setNo] = useState(0)
  	const [name, setName] = useState("")
  	const [email, setEmail] = useState("")
  	const [gender, setGender] = useState(true)
	const [previewImg, setPreviewImg] = useState("../img01.jpg")
    const [base64File, setBase64File] = useState(null)

  	const { checkAuth } = useAuth()
  	const navigate = useNavigate()
  	const submitEvent = e => {
    e.preventDefault()
    const params = { no,name,email, gender: gender ? 1:0, file: base64File }
    api.patch("/user", params)
    .then(res=>{
      alert(res.data.message)
      if(res.data.status) navigate("/user_view")
    })
    .catch(err => console.error(err))
  }
  

  	const imgEvent = () => {
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
			savefile(e.target.result)
			console.log(e.target.result)
          };
          reader.readAsDataURL(file);
        }
      });

      x.click();
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
  	
 	const event2 = async e => {
    e.preventDefault()
    const fileList = e.target.file.files
    const txt = e.target.txt.value
    const files = []
    for(let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const base64File = await fileToBase64(file)
      files[i] = base64File
    }
    const params = { txt, files }
    axios.post("http://localhost:8000/upload", params)
    .then(res=>console.log(res))
    .catch(err=>console.error(err))
  	}
  	
	const fileToBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file)

      reader.onload = () => {
        const data = reader.result.split(",")[1]
        resolve(data)
      }

      reader.onerror = err => {
        console.error(err)
        reject(err)
      }
    })
  	}

    return (
    <>
    <div className="container mt-3">
		<h1 className="display-1 text-center">회원정보 수정</h1>
      <div className="d-flex justify-content-center">
		<form onSubmit={event2}>
		<div className="form">
			<img className="d-block rounded-circle img-thumbnail mt-3 border user_pt" src={previewImg} alt="logo" id="preview" onClick={imgEvent} />
            <input type="file" name="file" id="file1" multiple accept="image/*" />
        </div>
		</form>
      </div>
		<form onSubmit={submitEvent}>
			<div className="mb-3 mt-3">
				<label htmlFor="name" className="form-label">이름</label>
				<input type="text" className="form-control" id="name" placeholder="이름을 입력하세요." name="name" readOnly="readonly" defaultValue={name}/>
			</div>
			<div className="mb-3 mt-3">
				<label htmlFor="email" className="form-label">이메일</label>
				<input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요." name="email" value={email} onChange={e=>setEmail(e.target.value)} />
			</div>
			<div className="mb-3 mt-3">
				<label htmlFor="regDate" className="form-label">가입일</label>
				<input type="text" className="form-control" id="regDate" placeholder="YYYY-MM-DD" name="regDate" disabled/>
			</div>
			<div className="d-flex">
				<div className="p-2 flex-fill">
					<div className="form-check">
						<input type="radio" className="form-check-input" id="radio1" name="gender" value="1" checked={gender} disabled/>남성
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
				<button type="submit" className="btn btn-primary">저장</button>
			</div>
			<div className="p-2 flex-fill d-grid">
				<button type="button" className="btn btn-primary"onClick={()=>navigate("/user_view")}>취소</button>
			</div>
		</div>
	</div>
    </>
    )
}
export default UserEdit