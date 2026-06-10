#!/usr/bin/env python3

import json
import subprocess
import sys

CONFIG_FILE = "config.json"


def run(cmd):
    print("Executing:", " ".join(cmd))
    result = subprocess.run(cmd)
    if result.returncode != 0:
        sys.exit(result.returncode)


def load_config():
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def attach(profile, api_id, authorizer_id, resource_id, method):
    run([
        "aws", "apigateway", "update-method",
        "--profile", profile,
        "--rest-api-id", api_id,
        "--resource-id", resource_id,
        "--http-method", method,
        "--patch-operations",
        "op=replace,path=/authorizationType,value=CUSTOM",
        f"op=replace,path=/authorizerId,value={authorizer_id}"
    ])


def detach(profile, api_id, resource_id, method):
    run([
        "aws", "apigateway", "update-method",
        "--profile", profile,
        "--rest-api-id", api_id,
        "--resource-id", resource_id,
        "--http-method", method,
        "--patch-operations",
        "op=replace,path=/authorizationType,value=NONE"
    ])


cfg = load_config()

print("\nSelect Account")
print("1 - Admin")
print("2 - Consumer")

account_choice = input("Choice: ").strip()

if account_choice == "1":
    account = cfg["accounts"]["admin"]
elif account_choice == "2":
    account = cfg["accounts"]["consumer"]
else:
    print("Invalid account selection")
    sys.exit(1)

print("\nSelect Action")
print("A - Attach Authorizer")
print("D - Detach Authorizer")

action = input("Choice: ").strip().upper()

profile = account["profile"]
api = account["api"]

rest_api_id = api["rest_api_id"]
authorizer_id = api["authorizer_id"]
stage = api["stage"]

for resource_name, resource in api["resources"].items():

    resource_id = resource["resource_id"]
    methods = resource["http_methods"]

    for method in methods:

        print(f"\nProcessing {resource_name} [{method}]")

        if action == "A":
            attach(
                profile,
                rest_api_id,
                authorizer_id,
                resource_id,
                method
            )

        elif action == "D":
            detach(
                profile,
                rest_api_id,
                resource_id,
                method
            )

        else:
            print("Invalid action")
            sys.exit(1)

print("\nDeploying API Gateway...")

run([
    "aws",
    "apigateway",
    "create-deployment",
    "--profile",
    profile,
    "--rest-api-id",
    rest_api_id,
    "--stage-name",
    stage
])

print("\nCompleted Successfully")
