import { NextResponse } from 'next/server';

const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "INTERNAL SERVER ERROR";
    const extraDetails = err.extraDetails || "Error From Backend Server";
    
    return NextResponse.json(
        { message, extraDetails },
        { status }
    );
};

export default errorMiddleware;
