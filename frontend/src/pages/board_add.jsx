import { useState } from "react"
import { usetNavigate, useParams} from "react-router" 
import axios from "axios"   


   const board_add = () =>{
    const [title,set_title] = useState("")
    const [content, set_content] = useState("")
    const navigate = useNavigate();

    
    
    const submit_event = e =>{
        e.prevent_default()
        const params ={title,content} 
        api.put("/board", params) 
             .then(res=>{
                alert(res.data.message)
                if(res.data.status) navigate ("/")
               })  
            .catch(err=>console.error(err))
        
            }
   return(
    <>
    <div class="container mt-3">
		<h1 class="display-1 text-center">게시글 작성</h1>
		<form>
			<div class="mb-3 mt-3">
				<label for="title" class="form-label">제목</label>
				<input type="text" class="form-control" id="title" placeholder="제목을 입력하세요." name="title" defaultValue={title}/>
			</div>
						
			<div class="mb-3 mt-3">
				<label for="content" class="form-label">내용</label>
				<textarea type="text" class="form-control h-50" rows="10" placeholder="내용을 입력하세요."
					name="content"></textarea>
			</div>
			<div class="d-flex">
				<div class="p-2 flex-fill d-grid">
					<button type = "submit" class="btn btn-primary">등록</button>
				</div>
				<div class="p-2 flex-fill d-grid">
					<button type="button" className="btn btn-primary" onClick={(navigate=("/"))}>취소</button>
				</div>
			</div>
		</form>
	</div>
    </>
   )  
   }

   export default Board_edit