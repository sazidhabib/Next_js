import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <p>Normal Navabar</p>
            {children}
        </div>
    )
}

export default layout