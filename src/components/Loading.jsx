import React from "react";

const Loading = ({ message = "Loading..." }) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
            }}
        >
            <div>⏳</div>
            <div>{message}</div>
        </div>
    );
};

export default Loading;
