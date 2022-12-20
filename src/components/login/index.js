const LoginPage = (props) => {

    const handleSubmit = (e) => {
        e.preventDefault();

        // get values
        props.handleLogin();
    }

    return (
        <div className="login-container d-flex">
            <div className="side-section">
                <img src="/assets/images/bg-image.jpg" alt="bg "/>
            </div>

            <div className="login-section">
                <div className="login-header">
                    <div className="d-flex">
                        <img src="/assets/images/login_image.PNG" alt="login"/>
                    </div>

                    <div className="title">SISTEM KUTIPAN CUKAI BERSATU</div>
                </div>

                <form className="login-form" onSubmit={handleSubmit} method="post">
                    <div className="form-group">
                        <label>LOG MASUK: </label>
                        <input type="text" name="username" id="username" className="form-control" placeholder="administrator"/>
                    </div>

                    <div className="form-group">
                        <label>KATA LALUAN: </label>
                        <input type="text" name="password" id="password" className="form-control" placeholder="password"/>
                    </div>
                    

                    <div className="submit-section">
                        <button type="submit" className="btn btn-submit">
                            <span>Login</span>
                            <img src="/assets/icons/login.png" alt="login-button" />
                         </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default LoginPage;