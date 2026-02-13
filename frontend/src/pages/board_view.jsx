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
    });
    const [replies, set_replies] = useState([]); // 댓글 목록
    const [new_reply, set_new_reply] = useState(""); // 입력할 새 댓글

    const { title, content, name } = board;
    const [role, set_role] = useState(false); 
    
    const { user } = useAuth();
    const params = useParams();
    const navigate = useNavigate();

    const fetchBoard_data = useCallback(() => {
        // 백엔드 엔드포인트가 @router.post("/{no}") 이므로 post 유지
        api.get(`/board/${params.no}`)
            .then(res => {
                if (res.data.status) {
                    set_board(res.data.result);
                    set_role(res.data.role);
                } else {
                    alert(res.data.message);
                    navigate("/");
                }
            })
            .catch(err => console.error("데이터를 가져오는데 실패했습니다:", err));
    }, [params.no, navigate]);
    
    const edit = () => {
        if (!user) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }
        if (!role) {
            alert("본인이 작성한 글만 수정 가능합니다.");
            return;
        }
        navigate(`/board_edit/${params.no}`);
    };

    const del_event = () => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
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
    if (!user) return alert("로그인이 필요합니다."); // 로그인 체크 추가
    if (!new_reply.trim()) return alert("댓글 내용을 입력하세요.");

    api.post("/board/reply", { boardNo: params.no, content: new_reply }) // POST 권장
        .then(res => {
            if (res.data.status) {
                set_new_reply(""); 
                // 페이지 전체를 새로고침하는 대신 데이터를 다시 불러오거나 상태를 업데이트합니다.
                fetchBoard_data(); 
                alert("댓글이 등록되었습니다.");
            } else {
                alert(res.data.message);
            }
        })
        .catch(err => console.error("댓글 등록 실패:", err));
};

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
                    <label className="form-label">작성자</label>
                    <input type="text" className="form-control" readOnly value={name || ''} />
                </div>
                <div className="mb-3 mt-3">
                    <label className="form-label">내용</label>
                    <textarea className="form-control" style={{ resize: "none" }} rows="10" readOnly value={content || ''}></textarea>
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
                {replies.length > 0 ? (
                    replies.map((r, i) => (
                        <li key={i} className="list-group-item">
                            <strong>{r.name}</strong>: {r.content}
                        </li>
                    ))
                ) : (
                    <li className="list-group-item text-muted">등록된 댓글이 없습니다.</li>
                )}
            </ul>

            {/* 3. 댓글 입력창 UI 추가 */}
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="댓글을 입력하세요" 
                    value={new_reply}
                    onChange={(e) => set_new_reply(e.target.value)}
                />
                <button className="btn btn-success" type="button" onClick={reply_submit}>등록</button>
            </div>
        </div>

        
    );
}; 

export default Board_view;