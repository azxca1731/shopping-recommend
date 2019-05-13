import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

import { SEARCH } from "queries";

const ProductListDiv = styled.div``;

const ProductRow = styled.div`
	border: 1px solid #000;
`;

const ProductList = ({ query }) => {
	const [currentFrom, setFrom] = useState(0);
	let total;
	return (
		<ProductListDiv>
			<Query
				query={SEARCH}
				variables={{ query, from: currentFrom, size: 5 }}
			>
				{({ loading, error, data: { search } }) => {
					if (loading) return "loading";
					if (error) return `Error! ${error}`;
					total = search.total;
					return search
						? search.productList.map(({ name, id }, index) => (
								<ProductRow key={id}>
									{currentFrom + index + 1} {name}
								</ProductRow>
						  ))
						: null;
				}}
			</Query>
			<button
				onClick={() => currentFrom - 5 >= 0 && setFrom(currentFrom - 5)}
			>
				이전
			</button>
			<button
				onClick={() =>
					currentFrom + 5 <= total && setFrom(currentFrom + 5)
				}
			>
				다음
			</button>
		</ProductListDiv>
	);
};

ProductList.propTypes = {
	query: PropTypes.string.isRequired
};

export default ProductList;
