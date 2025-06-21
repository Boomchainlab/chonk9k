# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

import os
from typing import Any, cast

import pytest

from chonk9k_api import Chonk9kAPI, AsyncChonk9kAPI

base_url = os.environ.get("TEST_API_BASE_URL", "http://127.0.0.1:4010")


class TestClaim:
    parametrize = pytest.mark.parametrize("client", [False, True], indirect=True, ids=["loose", "strict"])

    @pytest.mark.skip()
    @parametrize
    def test_method_create(self, client: Chonk9kAPI) -> None:
        claim = client.claim.create()
        assert claim is None

    @pytest.mark.skip()
    @parametrize
    def test_method_create_with_all_params(self, client: Chonk9kAPI) -> None:
        claim = client.claim.create(
            wallet="wallet",
        )
        assert claim is None

    @pytest.mark.skip()
    @parametrize
    def test_raw_response_create(self, client: Chonk9kAPI) -> None:
        response = client.claim.with_raw_response.create()

        assert response.is_closed is True
        assert response.http_request.headers.get("X-Stainless-Lang") == "python"
        claim = response.parse()
        assert claim is None

    @pytest.mark.skip()
    @parametrize
    def test_streaming_response_create(self, client: Chonk9kAPI) -> None:
        with client.claim.with_streaming_response.create() as response:
            assert not response.is_closed
            assert response.http_request.headers.get("X-Stainless-Lang") == "python"

            claim = response.parse()
            assert claim is None

        assert cast(Any, response.is_closed) is True


class TestAsyncClaim:
    parametrize = pytest.mark.parametrize(
        "async_client", [False, True, {"http_client": "aiohttp"}], indirect=True, ids=["loose", "strict", "aiohttp"]
    )

    @pytest.mark.skip()
    @parametrize
    async def test_method_create(self, async_client: AsyncChonk9kAPI) -> None:
        claim = await async_client.claim.create()
        assert claim is None

    @pytest.mark.skip()
    @parametrize
    async def test_method_create_with_all_params(self, async_client: AsyncChonk9kAPI) -> None:
        claim = await async_client.claim.create(
            wallet="wallet",
        )
        assert claim is None

    @pytest.mark.skip()
    @parametrize
    async def test_raw_response_create(self, async_client: AsyncChonk9kAPI) -> None:
        response = await async_client.claim.with_raw_response.create()

        assert response.is_closed is True
        assert response.http_request.headers.get("X-Stainless-Lang") == "python"
        claim = await response.parse()
        assert claim is None

    @pytest.mark.skip()
    @parametrize
    async def test_streaming_response_create(self, async_client: AsyncChonk9kAPI) -> None:
        async with async_client.claim.with_streaming_response.create() as response:
            assert not response.is_closed
            assert response.http_request.headers.get("X-Stainless-Lang") == "python"

            claim = await response.parse()
            assert claim is None

        assert cast(Any, response.is_closed) is True
