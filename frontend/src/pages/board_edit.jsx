import { useState } from "react"
import { usetNavigate, useParams} from "react-router" 
import axios from "axios"   




const Board_edit = () =>{
    
        const [no, set_no] = useState(0)
        const [title, set_title] = useState("")
        const [content, set_content] = useState("")
        const [name, set_name] = useState("")
        const params = useParams();
        const naviagte = usetNavigate()
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
    const set_data = data => {
        set_data(data.no)
        set_content(data.content)
        set_name(data.name)
        set_title(data.title)
    

    
  return (
    <>
    <div class="container mt-3">
		<h1 class="display-1 text-center">게시글 수정</h1>
		<form>
			<div class="mb-3 mt-3">
				<label for="title" class="form-label">제목</label>
				<input type="text" class="form-control" id="title" placeholder="제목을 입력하세요." name="title" />
			</div>
			<div class="mb-3 mt-3">
				<label for="name" class="form-label">작성자</label>
				<input type="text" class="form-control" id="name" name="name" disabled />
			</div>
			<div class="mb-3 mt-3">
				<label for="content" class="form-label">내용</label>
				<textarea type="text" class="form-control h-50" rows="10" placeholder="내용을 입력하세요."
					name="content"></textarea>
			</div>
			<div class="d-flex">
				<div class="p-2 flex-fill d-grid">
					<button type="submit" className="btn btn-primary" >저장</button>
				</div>
				<div class="p-2 flex-fill d-grid">
					<button type="button"  className="btn btn-primary" onClick={(navigate=("/"))}>취소</button>
				</div>
			</div>
		</form>
	</div>
    
    </>
  )

    }

}

export default Board_edit 