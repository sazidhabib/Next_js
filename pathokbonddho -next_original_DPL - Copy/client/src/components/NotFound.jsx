import React from 'react';

const NotFound = () => {
    return (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center">
                <h1 className="display-1 text-danger">404</h1>
                <p className="lead">Oops! The page you are looking for does not exist.</p>
                <a href="/" className="btn btn-primary">Go Back to Home</a>
            </div>
        </div>
    );
};

export default NotFound;
