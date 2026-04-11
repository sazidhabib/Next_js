import { NextResponse } from 'next/server';

const validate = (schema) => async (req) => {
    try {
        const body = await req.json();
        const validatedData = await schema.parseAsync(body);
        return { success: true, data: validatedData };
    } catch (error) {
        console.log("Validation error:", error);

        if (error.errors && Array.isArray(error.errors)) {
            const message = error.errors[0].message;
            return NextResponse.json(
                { success: false, message },
                { status: 400 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Something went wrong during validation." },
                { status: 500 }
            );
        }
    }
};

export default validate;
