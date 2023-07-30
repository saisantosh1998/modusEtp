import { Button, Stack } from "@mui/material";
import React from "react";
import CustomButton from "./CustomButton";
import "./Pages.css";

function Pages({
  noOfPages,
  currentPage,
  handleNextPageCall,
  handlePrevPageCall,
  goToFirstPage,
  goToLastPage,
}) {
  const pagesArray = Array.from({ length: noOfPages }, (_, i) => i + 1);
  return (
    <>
      <Stack className="pagination" direction={"row"} spacing={2}>
        <Button
          variant="contained"
          onClick={goToFirstPage}
          className="custom-button"
          disabled={currentPage === 1}
        >
          &lt;&lt;
        </Button>
        <Button
          variant="contained"
          onClick={handlePrevPageCall}
          className="custom-button"
          disabled={currentPage === 1}
        >
          &lt;
        </Button>
        {pagesArray.length > 0 ? (
          pagesArray.map((page) => (
            <CustomButton
              selectedPage={currentPage}
              key={`page-${page}`}
              number={page}
            />
          ))
        ) : (
          <></>
        )}
        <Button
          variant="contained"
          onClick={handleNextPageCall}
          className="custom-button"
          disabled={currentPage === noOfPages}
        >
          &gt;
        </Button>
        <Button
          variant="contained"
          onClick={goToLastPage}
          className="custom-button"
          disabled={currentPage === noOfPages}
        >
          &gt;&gt;
        </Button>
      </Stack>
    </>
  );
}

export default Pages;
