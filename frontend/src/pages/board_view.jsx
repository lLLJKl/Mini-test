import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from '@/utils/network.js'; 
import { useAuth } from '@/hooks/Authprovider.jsx';




const Board_view = () => {
        const [board, set_board] = useState({
        no: 0,
        title: "",
        content: "",
        name: "",
        reply: []    
    });
    
    const {no, title, content, name, reg_date, reply } = board;
    const [new_reply, set_new_reply] =useState("")
    const [role, set_role] = useState(false); 
    
    const { user } = useAuth();
    const params = useParams();
    const navigate = useNavigate();

    
    const fetchBoard_data= useCallback(()=>{
        api.post(`/board/${params.no}`)
            .then(res =>{
                if (res.data.status) {
                set_board(res.data.result);
                set_role(res.data.role);
                }else {
                    alert(res.data.message);
                    navigate("/")
                }
            })
            .catch(err => console.error("불러오지 못했습니다:" ,err));
        }, [params.no, navigate]);
    
    const edit = () => {
    // 1. 로그인 여부 확인 (checkAuth 대신 user 객체 존재 여부 확인)
    if (!user) {
        alert("로그인이 필요한 서비스입니다.");
        return;
    }

    // 2. 본인 작성 여부 확인 (작성자 ID와 현재 로그인한 유저 ID 비교)
    // board.writer_id와 user.id는 백엔드에서 내려주는 필드명에 맞추세요.
    if (!role) {
        alert("본인이 작성한 글만 수정 가능합니다.");
        return;
    }

    // 3. 모든 검사를 통과했을 때만 페이지 이동
    navigate(`/board_edit/${params.no}`);
};

    const del_event = () => {
        if (window.confirm("삭제하시겠습니까?")) {
            api.delete(`/board/${params.no}`) 
                .then(res => {
                    alert(res.data.message);
                    if (res.data.status) navigate("/");
                })
                .catch(err => console.error(err));
        }
    };

   
    
    useEffect(() => {
        fetchBoard_data();
    }, [fetchBoard_data]);
    
    const reply_submit = () => {
        if (!new_reply.trim()) return alert("댓글 내용을 입력하세요.");
        api.put("/board", { boardNo: params.no, content: new_reply })
            .then(res => {
                if (res.data.status) {
                    set_new_reply("");
                    fetchBoard_data(); 
                    }else {
                    alert(res.data.message);
                }
            })
    .catch(err => console.error("댓글 등록 실패:", err));
};   //댓글 등록 부분
                    

    
    return (
        <div className="container mt-3 mb-5">
            <h1 className="display-4 text-center">게시글</h1>
            <div className="card mb-3">
                <div className="card-body">
                    <h2 className="card-title">{title}</h2>
                   
                </div>
            </div>

            <form>
                
                <div className="mb-3 mt-3">
                    <label htmlFor="name" className="form-label">작성자</label>
                    <input type="text" className="form-control" readOnly value={name} />
                </div>
                <div className="mb-3 mt-3">
                    <label htmlFor="reg_date" className="form-label">작성날짜</label>
                    <input type="text" className="form-control" readOnly value={reg_date} />
                </div>
                <div className="mb-3 mt-3">
                    <label htmlFor="content" className="form-label">내용</label>
                    <textarea className="form-control h-50" style={{ resize: "none" }} rows="10" readOnly value={content}></textarea>
                </div>
            </form>

            <div className="d-flex mb-4">
                {role && (
                    <>
                        <div className="p-2 flex-fill d-grid">
                            <button type="button" className="btn btn-primary" onClick={edit}>수정</button>
                        </div>
                        <div className="p-2 flex-fill d-grid">
                            <button type="button" className="btn btn-danger" onClick={del_event}>삭제</button>
                        </div>
                    </>
                )}
                <div className="p-2 flex-fill d-grid">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>목록으로</button>
                </div>
            </div>

            <hr />
            <h4 className="mb-3">댓글</h4>
            <ul className="list-group mb-3">
                {reply && reply.map((c) => (
                    <li key={c.no} className="list-group-item">
                        <strong>{c.name}</strong> : {c.content}
                    </li>
                ))}
            </ul>

            <div className="input-group mb-3">
                <input type="text" className="form-control" value={new_reply}
                    onChange={(e) => set_new_reply(e.target.value)} placeholder="댓글을 입력하세요" />
                <button type="button" className="btn btn-success" onClick={reply_submit}>등록</button>
            </div>
        </div>
    );
}; 

export default Board_view;