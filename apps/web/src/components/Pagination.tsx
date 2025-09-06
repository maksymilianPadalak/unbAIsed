'use client';

import ReactPaginate from 'react-paginate';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = ({ selected }: { selected: number }) => {
    onPageChange(selected + 1);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-12">
      {/* Mobile Pagination */}
      <div className="block lg:hidden">
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={0}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={currentPage - 1}
          containerClassName="flex justify-center items-center gap-1"
          pageClassName="flex-shrink-0"
          pageLinkClassName="brutalist-button px-2 py-1 text-xs block min-w-[1.5rem]"
          previousClassName={currentPage === 3 ? 'hidden' : 'flex-shrink-0'}
          previousLinkClassName="brutalist-button px-2 py-1 text-xs block"
          nextClassName={currentPage === 3 ? 'hidden' : 'flex-shrink-0'}
          nextLinkClassName="brutalist-button px-2 py-1 text-xs block"
          activeClassName="flex-shrink-0"
          activeLinkClassName="brutalist-button brutalist-active px-2 py-1 text-xs block min-w-[1.5rem]"
          disabledClassName="opacity-50 cursor-not-allowed flex-shrink-0"
          disabledLinkClassName="brutalist-button px-2 py-1 text-xs block opacity-50 cursor-not-allowed"
          breakClassName="flex-shrink-0"
          breakLinkClassName="text-white font-mono px-1 py-1 text-xs"
          previousLabel="PREV"
          nextLabel="NEXT"
          breakLabel="..."
        />
      </div>

      {/* Desktop Pagination */}
      <div className="hidden lg:block">
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={currentPage - 1}
          containerClassName="flex justify-center items-center gap-2"
          pageClassName="flex-shrink-0"
          pageLinkClassName="brutalist-button px-3 py-2 text-base block min-w-[3rem]"
          previousClassName="flex-shrink-0"
          previousLinkClassName="brutalist-button px-4 py-2 text-base block"
          nextClassName="flex-shrink-0"
          nextLinkClassName="brutalist-button px-4 py-2 text-base block"
          activeClassName="flex-shrink-0"
          activeLinkClassName="brutalist-button brutalist-active px-3 py-2 text-base block min-w-[3rem]"
          disabledClassName="opacity-50 cursor-not-allowed flex-shrink-0"
          disabledLinkClassName="brutalist-button px-4 py-2 text-base block opacity-50 cursor-not-allowed"
          breakClassName="flex-shrink-0"
          breakLinkClassName="text-white font-mono px-2 py-2 text-base"
          previousLabel="PREV"
          nextLabel="NEXT"
          breakLabel="..."
        />
      </div>
    </div>
  );
}
