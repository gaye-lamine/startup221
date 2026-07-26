ADMIN_PASSWORD = "admin-pass"
STARTUP_PASSWORD = "startup-pass"


def test_startup_login_and_dashboard_protection(client):
    protected_without_token = client.get("/api/v1/dashboard/stats/senpay")
    assert protected_without_token.status_code == 401

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "fondateur@senpay.sn", "password": STARTUP_PASSWORD},
    )
    assert login_response.status_code == 200
    token = login_response.json()["token"]
    assert token

    protected_with_token = client.get(
        "/api/v1/dashboard/stats/senpay",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert protected_with_token.status_code == 200
    payload = protected_with_token.json()
    assert payload["is_live"] is True
    assert payload["contact_requests"] == 1


def test_startups_listing_with_filters(client):
    response = client.get(
        "/api/v1/startups",
        params={"min_employees": 10, "max_employees": 30, "sector": "Fintech"},
    )
    assert response.status_code == 200

    payload = response.json()
    assert payload["total"] == 1
    assert len(payload["items"]) == 1
    assert payload["items"][0]["slug"] == "senpay"


def test_admin_login_and_protection(client):
    protected_without_token = client.get("/api/v1/admin/startups")
    assert protected_without_token.status_code == 401

    login_response = client.post(
        "/api/v1/admin/login",
        json={"password": ADMIN_PASSWORD},
    )
    assert login_response.status_code == 200
    token = login_response.json()["token"]
    assert login_response.json()["token_type"] == "bearer"

    protected_startups = client.get(
        "/api/v1/admin/startups",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert protected_startups.status_code == 200
    assert len(protected_startups.json()) == 2

    protected_investors = client.get(
        "/api/v1/admin/investors",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert protected_investors.status_code == 200
    assert len(protected_investors.json()) == 1
