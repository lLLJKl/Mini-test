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
    const [replies, set_replies] = useState([]); 
    const [new_reply, set_new_reply] = useState(""); 
    const [role, set_role] = useState(false); 

    const { user } = useAuth();
    const params = useParams();
    const navigate = useNavigate();

    const fetchBoard_data = useCallback(() => {
        api.get(`/board/${params.no}`)
            .then(res => {
                if (res.data.status) {
                    set_board(res.data.result);
                    set_role(res.data.role);
                    // [수정] 댓글 목록이 res.data.replies 등으로 온다면 여기서 업데이트!
                    if (res.data.replies) set_replies(res.data.replies);
                } else {
                    alert(res.data.message);
                    navigate("/");
                }
            })
            .catch(err => console.error("데이터를 가져오는데 실패했습니다:", err));
    }, [params.no, navigate]);

    useEffect(() => {
        fetchBoard_data();
    }, [fetchBoard_data]);

    const reply_submit = () => {
        if (!user) return alert("로그인이 필요합니다.");
        if (!new_reply.trim()) return alert("댓글 내용을 입력하세요.");

        api.post("/board/reply", { boardNo: params.no, content: new_reply })
            .then(res => {
                if (res.data.status) {
                    set_new_reply(""); 
                    fetchBoard_data(); // 데이터 갱신
                    alert("댓글이 등록되었습니다.");
                } else {
                    alert(res.data.message);
                }
            })
            .catch(err => console.error("댓글 등록 실패:", err));
    };

    // [추가] 엔터키 입력 핸들러
    const onKeyPress = (e) => {
        if (e.key === 'Enter') reply_submit();
    };

    return (
        <div className="container mt-3 mb-5">
            <h1 className="display-4 text-center">게시글</h1>
            <div className="card mb-3">
                <div className="card-body">
                    {/* board 객체에서 직접 꺼내 쓰면 초기 렌더링 시 undefined 에러를 방지합니다 */}
                    <h2 className="card-title">{board.title}</h2>
                </div>
            </div>

            <form>
                <div className="mb-3">
                    <label className="form-label">작성자</label>
                    <input type="text" className="form-control" readOnly value={board.name || ''} />
                </div>
                <div className="mb-3">
                    <label className="form-label">내용</label>
                    <textarea className="form-control" style={{ resize: "none" }} rows="10" readOnly value={board.content || ''}></textarea>
                </div>
            </form>

            <div className="d-flex mb-4">
                {role && (
                    <>
                        <div className="p-2 flex-fill d-grid">
                            <button type="button" className="btn btn-primary" onClick={() => navigate(`/board_edit/${params.no}`)}>수정</button>
                        </div>
                        <div className="p-2 flex-fill d-grid">
                            <button type="button" className="btn btn-danger" onClick={() => {
                                if (window.confirm("정말로 삭제하시겠습니까?")) {
                                    api.delete(`/board/${params.no}`).then(res => {
                                        alert(res.data.message);
                                        if (res.data.status) navigate("/");
                                    });
                                }
                            }}>삭제</button>
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
                    replies.map((r) => (
                        <li key={r.no || r.id} className="list-group-item">
                            <strong>{r.name}</strong>: {r.content}
                        </li>
                    ))
                ) : (
                    <li className="list-group-item text-muted">등록된 댓글이 없습니다.</li>
                )}
            </ul>

            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder={user ? "댓글을 입력하세요" : "로그인 후 이용 가능합니다"} 
                    value={new_reply}
                    onChange={(e) => set_new_reply(e.target.value)}
                    onKeyPress={onKeyPress} // 엔터키 추가
                    disabled={!user} // 로그인 안하면 입력 불가
                />
                <button 
                    className="btn btn-success" 
                    type="button" 
                    onClick={reply_submit}
                    disabled={!user}
                >등록</button>
            </div>
        </div>
    );
};

export default Board_view;