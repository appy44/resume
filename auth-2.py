#!/usr/bin/env python3
import subprocess

ACCOUNTS = {
    "A": {
        "name": "Admin",
        "profile": "admin"
    },
    "C": {
        "name": "Consumer",
        "profile": "consumer"
    }
}

def run(cmd):
    print("\nExecuting:")
    print(" ".join(cmd))
    subprocess.run(cmd, check=True)

print("Select AWS Profile")
print("A - Admin")
print("C - Consumer")

acct = input("Choice: ").strip().upper()

if acct not in ACCOUNTS:
    print("Invalid selection")
    raise SystemExit(1)

profile = ACCOUNTS[acct]["profile"]

rest_api_id = input("REST API ID: ").strip()
resource_id = input("Resource ID: ").strip()
http_method = input("HTTP Method [GET]: ").strip().upper() or "GET"
stage = input("Stage Name [dev]: ").strip() or "dev"

print("\nSelect Action")
print("A - Attach Authorizer")
print("D - Detach Authorizer")

action = input("Choice: ").strip().upper()

if action == "A":
    authorizer_id = input("Authorizer ID: ").strip()

    run([
        "aws", "apigateway", "update-method",
        "--profile", profile,
        "--rest-api-id", rest_api_id,
        "--resource-id", resource_id,
        "--http-method", http_method,
        "--patch-operations",
        "op=replace,path=/authorizationType,value=CUSTOM",
        f"op=replace,path=/authorizerId,value={authorizer_id}"
    ])

    print("Authorizer attached")

elif action == "D":
    run([
        "aws", "apigateway", "update-method",
        "--profile", profile,
        "--rest-api-id", rest_api_id,
        "--resource-id", resource_id,
        "--http-method", http_method,
        "--patch-operations",
        "op=replace,path=/authorizationType,value=NONE"
    ])

    print("Authorizer detached")

else:
    print("Invalid action")
    raise SystemExit(1)

run([
    "aws", "apigateway", "create-deployment",
    "--profile", profile,
    "--rest-api-id", rest_api_id,
    "--stage-name", stage
])

print("Deployment completed.")
