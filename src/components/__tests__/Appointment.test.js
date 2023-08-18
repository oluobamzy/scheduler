import Application from "components/Application";
import React from "react";
import {render} from "@testing-library/react";
import Button from "components/Button";


it("renders without crashing", () => {
    render(<Button />);
});
