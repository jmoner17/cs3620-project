"""
Usage:
    python test.py --device-id device[0-9] --password [A-Za-z0-9]

Environment variables required:
    SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY
"""

import os
import argparse
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path="./.env.local", override=False)


def get_supabase_client() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or os.environ.get("SUPABASE_ANON_KEY")
    )

    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) "
            "must be set in the environment."
        )

    return create_client(url, key)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Append a new device row into public.devices."
    )
    parser.add_argument(
        "--device-id",
        required=True,
        help="Unique device_id (text, primary key in public.devices).",
    )
    parser.add_argument(
        "--password",
        "--device-password",
        dest="device_password",
        required=False,
        help="Optional device_password to store with the device.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    supabase = get_supabase_client()

    row = {
        "device_id": args.device_id,
        "device_password": args.device_password,
    }

    response = (
        supabase.table("devices")
        .insert(row)
        .execute()
    )

    print("Inserted device row:")
    print(response.data)


if __name__ == "__main__":
    main()