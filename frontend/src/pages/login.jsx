const Login = () => {
    return(
        <>
            <div className="container mt-3 box_size">
                <h1 className="display-1 text-center">로그인</h1>
                <form>
                    <div className="mb-3 mt-3">
                        <label for="email" className="form-label">이메일</label>
                        <input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요." name="email"/>
                    </div>
                    <div className="d-flex mb-4">
                        <div className="p-2 flex-fill d-grid">
                            <a href="../index.html" className="btn btn-primary">메일 발송</a>
                        </div>
                        <div className="p-2 flex-fill d-grid ">
                            <a href="../index.html" className="btn btn-primary">취소</a>
                        </div>
                    </div>
                </form>
                <form>
                    <div className="mb-3 d-flex">
                        <input type="password" className="form-control" id="pwd" placeholder="인증번호를 입력하세요" name="pwd"/>
                        <button type="submit" className="w-25 btn btn-primary">인증</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login