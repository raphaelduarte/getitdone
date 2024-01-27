import React from 'react'

export default function ButtonSellPage() {

    const buttonStyle = {
        padding: "10px 20px",
        border: "none",
        fontSize: "17px",
        color: "#fff",
        borderRadius: "7px",
        letterSpacing: "4px",
        fontWeight: "700",
        textTransform: "uppercase",
        transition: "0.5s",
        transitionProperty: "box-shadow",
        background: "rgb(0,140,255)",
        boxShadow: "0 0 25px rgb(0,140,255)",
        ':hover': {
            boxShadow: "0 0 5px rgb(0,140,255), 0 0 25px rgb(0,140,255), 0 0 50px rgb(0,140,255), 0 0 100px rgb(0,140,255)"
        }
    }




    return (
        <div>
            <button class={buttonStyle}>
                Compre agora
            </button>
        </div>
    )
}
