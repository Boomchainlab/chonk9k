# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

import httpx

from ..types import claim_create_params
from .._types import NOT_GIVEN, Body, Query, Headers, NoneType, NotGiven
from .._utils import maybe_transform, async_maybe_transform
from .._compat import cached_property
from .._resource import SyncAPIResource, AsyncAPIResource
from .._response import (
    to_raw_response_wrapper,
    to_streamed_response_wrapper,
    async_to_raw_response_wrapper,
    async_to_streamed_response_wrapper,
)
from .._base_client import make_request_options

__all__ = ["ClaimResource", "AsyncClaimResource"]


class ClaimResource(SyncAPIResource):
    @cached_property
    def with_raw_response(self) -> ClaimResourceWithRawResponse:
        """
        This property can be used as a prefix for any HTTP method call to return
        the raw response object instead of the parsed content.

        For more information, see https://www.github.com/Boomchainlab/chonk9k#accessing-raw-response-data-eg-headers
        """
        return ClaimResourceWithRawResponse(self)

    @cached_property
    def with_streaming_response(self) -> ClaimResourceWithStreamingResponse:
        """
        An alternative to `.with_raw_response` that doesn't eagerly read the response body.

        For more information, see https://www.github.com/Boomchainlab/chonk9k#with_streaming_response
        """
        return ClaimResourceWithStreamingResponse(self)

    def create(
        self,
        *,
        wallet: str | NotGiven = NOT_GIVEN,
        # Use the following arguments if you need to pass additional parameters to the API that aren't available via kwargs.
        # The extra values given here take precedence over values defined on the client or passed to this method.
        extra_headers: Headers | None = None,
        extra_query: Query | None = None,
        extra_body: Body | None = None,
        timeout: float | httpx.Timeout | None | NotGiven = NOT_GIVEN,
    ) -> None:
        """
        Claim daily rewards

        Args:
          extra_headers: Send extra headers

          extra_query: Add additional query parameters to the request

          extra_body: Add additional JSON properties to the request

          timeout: Override the client-level default timeout for this request, in seconds
        """
        extra_headers = {"Accept": "*/*", **(extra_headers or {})}
        return self._post(
            "/claim",
            body=maybe_transform({"wallet": wallet}, claim_create_params.ClaimCreateParams),
            options=make_request_options(
                extra_headers=extra_headers, extra_query=extra_query, extra_body=extra_body, timeout=timeout
            ),
            cast_to=NoneType,
        )


class AsyncClaimResource(AsyncAPIResource):
    @cached_property
    def with_raw_response(self) -> AsyncClaimResourceWithRawResponse:
        """
        This property can be used as a prefix for any HTTP method call to return
        the raw response object instead of the parsed content.

        For more information, see https://www.github.com/Boomchainlab/chonk9k#accessing-raw-response-data-eg-headers
        """
        return AsyncClaimResourceWithRawResponse(self)

    @cached_property
    def with_streaming_response(self) -> AsyncClaimResourceWithStreamingResponse:
        """
        An alternative to `.with_raw_response` that doesn't eagerly read the response body.

        For more information, see https://www.github.com/Boomchainlab/chonk9k#with_streaming_response
        """
        return AsyncClaimResourceWithStreamingResponse(self)

    async def create(
        self,
        *,
        wallet: str | NotGiven = NOT_GIVEN,
        # Use the following arguments if you need to pass additional parameters to the API that aren't available via kwargs.
        # The extra values given here take precedence over values defined on the client or passed to this method.
        extra_headers: Headers | None = None,
        extra_query: Query | None = None,
        extra_body: Body | None = None,
        timeout: float | httpx.Timeout | None | NotGiven = NOT_GIVEN,
    ) -> None:
        """
        Claim daily rewards

        Args:
          extra_headers: Send extra headers

          extra_query: Add additional query parameters to the request

          extra_body: Add additional JSON properties to the request

          timeout: Override the client-level default timeout for this request, in seconds
        """
        extra_headers = {"Accept": "*/*", **(extra_headers or {})}
        return await self._post(
            "/claim",
            body=await async_maybe_transform({"wallet": wallet}, claim_create_params.ClaimCreateParams),
            options=make_request_options(
                extra_headers=extra_headers, extra_query=extra_query, extra_body=extra_body, timeout=timeout
            ),
            cast_to=NoneType,
        )


class ClaimResourceWithRawResponse:
    def __init__(self, claim: ClaimResource) -> None:
        self._claim = claim

        self.create = to_raw_response_wrapper(
            claim.create,
        )


class AsyncClaimResourceWithRawResponse:
    def __init__(self, claim: AsyncClaimResource) -> None:
        self._claim = claim

        self.create = async_to_raw_response_wrapper(
            claim.create,
        )


class ClaimResourceWithStreamingResponse:
    def __init__(self, claim: ClaimResource) -> None:
        self._claim = claim

        self.create = to_streamed_response_wrapper(
            claim.create,
        )


class AsyncClaimResourceWithStreamingResponse:
    def __init__(self, claim: AsyncClaimResource) -> None:
        self._claim = claim

        self.create = async_to_streamed_response_wrapper(
            claim.create,
        )
