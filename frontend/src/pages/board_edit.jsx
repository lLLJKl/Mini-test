import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { api } from '@/utils/network.js';



const Board_edit = () =>{
    
        const [no, set_no] = useState(0)
        const [title, set_title] = useState("")
        const [content, set_content] = useState("")
        const [name, set_name] = useState("")
        const params = useParams();
        const navigate = usetNavigate()
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
    };
   useEffect(() => {
        api.post(`/board/${params.no}`)
            .then(res => {
                if (res.data.status) {
                    set_data(res.data.result);
                } else {
                    alert(res.data.message);
                    navigate("/");
                }
            })
            .catch(err => console.error(err));
    }, [params.no]); 

return (
        <div className="container mt-3">
            <h1 className="display-1 text-center">게시글 수정</h1>
            <form onSubmit={submit_event}>
                <div className="mb-3 mt-3">
                    <label htmlFor="title" className="form-label">제목</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="title" 
                        value={title} 
                        onChange={(e) => set_title(e.target.value)} 
                    />
                </div>
                <div className="mb-3 mt-3">
                    <label htmlFor="name" className="form-label">작성자</label>
                    <input type="text" className="form-control" id="name" value={name} disabled />
                </div>
                <div className="mb-3 mt-3">
                    <label htmlFor="content" className="form-label">내용</label>
                    <textarea 
                        className="form-control h-50" 
                        rows="10" 
                        value={content} 
                        onChange={(e) => set_content(e.target.value)}
                    ></textarea>
                </div>
                <div className="d-flex">
                    <div className="p-2 flex-fill d-grid">
                        <button type="submit" className="btn btn-primary">저장</button>
                    </div>
                    <div className="p-2 flex-fill d-grid">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>취소</button>
                    </div>
                </div>
            </form>
        </div>
    );
};