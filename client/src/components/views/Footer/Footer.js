import React from 'react'

function Footer() {
    return (
        <div style={{
            backgroundColor: 'rgb(189, 10, 40)',
            color: 'black',
            fontWeight: 'bolder',
            height: '72px', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', fontSize: '1rem'
        }}>
            <p> &copy; MovieBoxDb {new Date().getFullYear()}  By. Reginald V. Bartiana </p>
        </div>
    )
}

export default Footer