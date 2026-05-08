import { Component, type ReactNode } from "react";

export class ThrowError extends Component {
    render(): ReactNode {
        throw new Error('Test child error');
    }
}