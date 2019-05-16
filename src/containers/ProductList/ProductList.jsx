import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { ClipLoader } from "react-spinners";

import { SEARCH, SEARCH_BY_CATEGORY } from "queries";
import Theme from "Theme";

const PRODUCTPAGECOUNT = 3;

const ProductListDiv = styled.div``;

const ProductRow = styled.div``;

const ProductList = ({ query, categoryId }) => {
	const [currentFrom, setFrom] = useState(0);
	let total;
	return (
		<ProductListDiv>
			<Query
				query={categoryId ? SEARCH_BY_CATEGORY : SEARCH}
				variables={
					categoryId
						? {
								categoryId,
								from: currentFrom,
								size: PRODUCTPAGECOUNT
						  }
						: { query, from: currentFrom, size: PRODUCTPAGECOUNT }
				}
			>
				{({ loading, error, data: { search, searchByCategory } }) => {
					if (loading)
						return (
							<>
								<ClipLoader
									sizeUnit={"px"}
									size={35}
									color={Theme.backgroundColor}
								/>
								<br />
							</>
						);
					if (error) return `Error! ${error}`;
					if (categoryId) {
						total = searchByCategory.total;
						return searchByCategory
							? searchByCategory.productList.map(
									({ name, id }, index) => (
										<ProductRow key={id}>
											{currentFrom + index + 1} {name}
										</ProductRow>
									)
							  )
							: null;
					} else {
						total = search.total;
						return search
							? search.productList.map(({ name, id }, index) => (
									<ProductRow key={id}>
										{currentFrom + index + 1} {name}
									</ProductRow>
							  ))
							: null;
					}
				}}
			</Query>
			<button
				onClick={() =>
					currentFrom - PRODUCTPAGECOUNT >= 0 &&
					setFrom(currentFrom - PRODUCTPAGECOUNT)
				}
			>
				이전
			</button>
			<button
				onClick={() =>
					currentFrom + PRODUCTPAGECOUNT <= total &&
					setFrom(currentFrom + PRODUCTPAGECOUNT)
				}
			>
				다음
			</button>
		</ProductListDiv>
	);
};

ProductList.propTypes = {
	query: PropTypes.string,
	categoryId: PropTypes.number
};

export default ProductList;
