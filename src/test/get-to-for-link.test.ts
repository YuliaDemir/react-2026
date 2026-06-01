import { getToForLink } from "@/utils/get-to-for-link";
import { beforeEach, describe, expect, it } from "vitest";

const setLocation = (url: string) => {
    window.history.pushState({}, "", url);
};

describe("getToForLink", () => {
    beforeEach(() => {
        setLocation("/products");
    });

    it("returns current pathname", () => {
        setLocation("/products?page=2");

        const result = getToForLink({ id: 10 });

        expect(result.pathname).toBe("/products");
    });

    it("sets details param from id", () => {
        const result = getToForLink({ id: 10 });

        expect(result).toEqual({
            pathname: "/products",
            search: "details=10",
        });
    });

    it("sets page param", () => {
        const result = getToForLink({ page: 3 });

        expect(result).toEqual({
            pathname: "/products",
            search: "page=3",
        });
    });

    it("sets q param", () => {
        const result = getToForLink({ q: "phone" });

        expect(result).toEqual({
            pathname: "/products",
            search: "q=phone",
        });
    });

    it("trims q before setting it", () => {
        const result = getToForLink({ q: "  phone  " });

        expect(result.search).toBe("q=phone");
    });

    it("sets several params at once", () => {
        const result = getToForLink({
            id: 15,
            page: 2,
            q: "laptop",
        });

        expect(result).toEqual({
            pathname: "/products",
            search: "details=15&page=2&q=laptop",
        });
    });

    it("keeps existing params when they are not passed in arg", () => {
        setLocation("/products?page=4&q=phone&details=10");

        const result = getToForLink({ page: 5 });

        expect(result.search).toBe("page=5&q=phone&details=10");
    });

    it("deletes details param when id is null", () => {
        setLocation("/products?page=2&details=10&q=phone");

        const result = getToForLink({ id: null });

        expect(result.search).toBe("page=2&q=phone");
    });

    it("deletes page param when page is null", () => {
        setLocation("/products?page=2&details=10&q=phone");

        const result = getToForLink({ page: null });

        expect(result.search).toBe("details=10&q=phone");
    });

    it("deletes q param when q is null", () => {
        setLocation("/products?page=2&details=10&q=phone");

        const result = getToForLink({ q: null });

        expect(result.search).toBe("page=2&details=10");
    });

    it("deletes q param when q is empty string", () => {
        setLocation("/products?page=2&q=phone");

        const result = getToForLink({ q: "" });

        expect(result.search).toBe("page=2");
    });

    it("deletes q param when q contains only spaces", () => {
        setLocation("/products?page=2&q=phone");

        const result = getToForLink({ q: "   " });

        expect(result.search).toBe("page=2");
    });

    it("deletes param when value is undefined and key is explicitly passed", () => {
        setLocation("/products?page=2&details=10&q=phone");

        const result = getToForLink({ id: undefined });

        expect(result.search).toBe("page=2&q=phone");
    });

    it("returns empty search when all params are deleted", () => {
        setLocation("/products?page=2&details=10&q=phone");

        const result = getToForLink({
            id: null,
            page: null,
            q: null,
        });

        expect(result).toEqual({
            pathname: "/products",
            search: "",
        });
    });
});