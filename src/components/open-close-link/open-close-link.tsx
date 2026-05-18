import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { getToForLink } from '@/utils/get-to-for-link';

type Props = {
    children: ReactNode,
    id?: number,
    className?: string,
    page?: number,
}

export const OpenCloseDetailsLink = ({ children, id, page, className }: Props) => {
    return <Link className={className} to={getToForLink(id, page)}> {children} </Link>;
};