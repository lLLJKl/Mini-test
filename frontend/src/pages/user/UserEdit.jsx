import { useState, useEffect } from 'react'
import { useNavigate } from "react-router";
import { useAuth } from '@hooks/AuthProvider.jsx'
import { api } from '@utils/network.js'

const UserEdit = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState(true)
  const [role, setRole] = useState(false)
  const [previewImg, setPreviewImg] = useState("/img_01.jpg")
  const [selectedFile, setSelectedFile] = useState(null)  // ← File 객체
  const { checkAuth } = useAuth()
  const navigate = useNavigate()

  const setData = data => {
    setName(data.name)
    setEmail(data.email)
    setGender(data.gender)
  }

  useEffect(() => {
    if (!checkAuth()) navigate("/")
    api.post("/user")
      .then(res => {
        if (res.data.status) {
          setData(res.data.result)
          setRole(res.data.role)
        } else {
          alert(res.data.message)
          navigate("/")
        }
      })
      .catch(err => console.error(err))
  }, [])

  const imgEvent = () => {
    const x = document.createElement("input")
    x.type = "file"
    x.accept = "image/*"
    x.addEventListener("change", (event) => {
      const file = event.target.files[0]
      if (file) {
        setPreviewImg(URL.createObjectURL(file))  // 미리보기
        setSelectedFile(file)                      // FormData용 File 객체
      }
    })
    x.click()
  }

  // FormData 방식으로 통일
  const submitEvent = e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("gender", gender ? 1 : 0)
    if (selectedFile) formData.append("file", selectedFile)

    api.patch("/user", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(res => {
        alert(res.data.message)
        if (res.data.status) navigate("/user_view")
      })
      .catch(err => console.error(err))
  }

  return (
    <div className="container mt-3">
      <h1 className="display-1 text-center">회원정보 수정</h1>

      {/* form 하나로 통합 */}
      <form onSubmit={submitEvent}>
        <div className="d-flex justify-content-center">
          <img
            className="d-block rounded-circle img-thumbnail mt-3 border user_pt"
            src={previewImg}
            alt="logo"
            id="preview"
            onClick={imgEvent}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="name" className="form-label">이름</label>
          <input type="text" className="form-control" id="name" name="name"
            placeholder="이름을 입력하세요." readOnly="readonly" defaultValue={name} />
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">이메일</label>
          <input type="email" className="form-control" id="email" name="email"
            placeholder="이메일을 입력하세요." value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="regDate" className="form-label">가입일</label>
          <input type="text" className="form-control" id="reg_date" placeholder="YYYY-MM-DD" disabled />
        </div>

        <div className="d-flex">
          <div className="p-2 flex-fill">
            <div className="form-check">
              <input type="radio" className="form-check-input" id="radio1"
                name="gender" value="1" checked={gender} onChange={() => setGender(true)} />남성
            </div>
          </div>
          <div className="p-2 flex-fill">
            <div className="form-check">
              <input type="radio" className="form-check-input" id="radio2"
                name="gender" value="2" checked={!gender} onChange={() => setGender(false)} />여성
            </div>
          </div>
        </div>

        {/* 버튼을 form 안으로 이동 */}
        <div className="d-flex mt-3">
          {role &&
            <div className="p-2 flex-fill d-grid">
              <button type="submit" className="btn btn-primary">저장</button>
            </div>
          }
          <div className="p-2 flex-fill d-grid">
            <button type="button" className="btn btn-secondary"
              onClick={() => navigate("/userview")}>취소</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UserEdit