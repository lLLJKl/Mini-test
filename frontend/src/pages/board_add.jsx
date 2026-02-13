import { useState, useEffect } from "react"
import { useNavigate} from "react-router" 
import { api } from '@utils/network.js'
import { useAuth } from '@hooks/AuthProvider.jsx'


   const Board_add = () =>{
    const [title, set_title] = useState("")
    const [content, set_content] = useState("")
    const navigate = useNavigate();
    const { checkAuth } = useAuth()
    
    
    
   const submit_event = e =>{
       e.prevent_default()
       const params ={title,content} 
       
        if (!title || !content) {
         alert("정보를 입력하세요");
         return;
        }
        api
        .put("/board_add", params) 
        .then(res=>{alert(res.data.message)
              if(res.data.status) 
               navigate ("/"),
               alert(`글이 등록되었습니다.`)
            })  
            .catch(err=>
               console.error(err),
               alert("오류 발생")
            )
        
      }
   useEffect(()=>{
    if(!checkAuth()) navigate("/");
  }, [])
   const click = e => {
      e.prevent_default()
      navigate("/")
   }
   return(
    <>
    <div className="container mt-3">
		<h1 className="display-1 text-center">게시글 작성</h1>
		<form onSubmit={submit_event}>
			<div className="mb-3 mt-3">
				<label htmlFor="title" className="form-label">제목</label>
				<input type="text" className="form-control" id="title" placeholder="제목을 입력하세요." name="title" defaultValue={title} onChange={e=>set_title(e.target.value)}/>
			</div>
						
			<div className="mb-3 mt-3">
				<label htmlFor="content" className="form-label">내용</label>
				<textarea type="text" className="form-control h-50" rows="10" placeholder="내용을 입력하세요." defaultValue={content} onChange={e=>set_content(e.target.value)}
					name="content"></textarea>
			</div>
			<div className="d-flex">
				<div className="p-2 flex-fill d-grid">
					<button type = "submit" className="btn btn-primary">등록</button>
				</div>
				<div className="p-2 flex-fill d-grid">
					<button type="button" className="btn btn-primary" onClick={e=>click}>취소</button>
				</div>
			</div>
		</form>
	</div>
    </>
   )  
   }

   export default Board_add