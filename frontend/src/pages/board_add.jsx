import { useState } from "react"
import { useNavigate, useParams} from "react-router" 
import { api } from '@/utils/network.js'


   const Board_add = () =>{
    const [title,set_title] = useState("")
    const [content, set_content] = useState("")
    const navigate = useNavigate();
    
    
    
    const submit_event = e =>{
        e.preventDefault();

        if (!title.trim()|| !content.trim()){
            alert("제목과 내용을 모두 입력해 주세요");
            return;
        }

    const data = {title,content};    
    api.post("/board", data)
    .then(res=>{
        alert(res.data.message);
        if (res.data.status) navigate("/")
    })
    .catch(err => console.error(err));
};        
        


   return(
    <>
    <div className="container mt-3">
		<h1 className="display-1 text-center">게시글 작성</h1>
		<form>
			<div className="mb-3 mt-3">
				<label htmlFor="title" className="form-label">제목</label>
				<input type="text" className="form-control" id="title" placeholder="제목을 입력하세요." name="title" default_value={title}/>
			</div>
						
			<div className="mb-3 mt-3">
				<label htmlFor="content" className="form-label">내용</label>
				<textarea type="text" className="form-control h-50" rows="10" placeholder="내용을 입력하세요."
					value={content} 
                    onChange={(e)=> set_content(e.target.value)}></textarea>
			</div>
			<div className="d-flex">
				<div className="p-2 flex-fill d-grid">
					<button type = "submit" className="btn btn-primary">등록</button>
				</div>
				<div className="p-2 flex-fill d-grid">
					<button type="button" className="btn btn-primary" onClick={()=>navigate=("/")}>취소</button>
				</div>
			</div>
		</form>
	</div>
    </>
   );  
   };

   export default Board_add;