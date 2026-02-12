import { useEffect, useState } from "react"
import { useNavigate, useParams} from "react-router" 
import axios from "axios"   
import {useAuth} from '@/hooks/Auth_provider.jsx'
 import { api } from "@/util/api.jsx"

 const Board_view = () =>{
    const [no,set_no] = useState(0)
    const [title,set_title] = useState("")
    const [content,set_content] = useState("")
    const [name,set_name] = useState("")
    const [reply,set_reply] = useState([])  
    const [new_comment,set_new_comment] = useState("")  
    const {user} = useAuth();
    const params = useParams();
    const navigate = useNavigate()
   
    const del_event = () =>{
        if (window.confirm("삭제하시겠습니까?"))
          api.delete ((`board$/{params.no}` ))            
          .then(res=>{
                   alert(res.data.message)
                   if(res.data.status) navigate ("/")
               })  
            .catch(err=>console.error(err))
        }
 };
    const set_data = data => {
        set_no(data.no) 
        set_title(data.title) 
        set_content(data.content)
        set_reply (data.reply)
        set_name(data.name)
        if (data.reply) set_reply(data.reply);
    };

    useEffect(()=>{
        api.post(`/board/${params.no}`)
        .then(res=>{
          if(res.data.status){
            set_data(res.data.result)
            set_role(res.data.role)
          } else {
            alert(res.data.message);
            navigate("/");
        }
    })
    .catch(err=>console.error(err));
},[params.no]);
   

    return(
                   
            <>
       <div className="container mt-3">
		<h1 className="display-4 text-center">게시글</h1>
		 <div className="card mb-4">
          <div className="card-body">
           <h2 className="card-title">{board.title}</h2>  
           <p className="text-muted">작성자: {name}</p>
          </div>
        </div>
       
        <form>
			<div className="mb-3 mt-3">
				<label htmlFor="title" className="form-label">제목</label>
				<input type="text" className="form-control" readOnly value={title} />
			</div>
			<div className="mb-3 mt-3">
				<label htmlFor="name" className="form-label">작성자</label>
				<input type="text" className="form-control" readOnly value={name} />
			</div>
			<div className="mb-3 mt-3">
				<label for="regDate" className="form-label">작성날짜</label>
				<input type="text" className="form-control"  readOnly value={reg_date} />
			</div>
			<div className="mb-3 mt-3">
				<label for="content" className="form-label">내용</label>
				<textarea type="text" className="form-control h-50" style={{resize:"none"}} rows="10" readOnly value={content}></textarea>
			</div>
		</form>
     
		<div className="d-flex">
          {role && (
            <>
			<div className="p-2 flex-fill d-grid">
				<button type="button" class="btn btn-primary" onClick={()=>(`boardedit/${no}`)}>수정</button>
			</div>
			<div className="p-2 flex-fill d-grid">
				<button type="button" class="btn btn-primary" onClick={del_event}>삭제</button>
			</div>
            </>
          )}
			<div className="p-2 flex-fill d-grid">
				<button type="button"  class="btn btn-primary" onClick={() => navigate=("/")}>취소</button>
			</div>
         <hr />   	
        <ul className="list-group mb-3">
         {comment && comment.map((c) => (
            <li key={c.no} className="list-group-item">
               <strong>{c.name}</strong> :{c.content}
            </li>
            ))}
        </ul>   
              
         <div className="input-group mb-3">
            <input type="text" className="form-control auto-resize" value = {new_comment} 
                onChange={(e)=> set_new_comment(e.target.value)} placeholder="댓글을 입력하세요" />
            <button type="button" className="btn btn-success btn-sm bottom-0 start- mx-2 mt-3">등록</button>    
         </div>
    </div>

    </>

    );
};
			

export default Board_view