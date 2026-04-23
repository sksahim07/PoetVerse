1#!/bin/bash
2
3ast-grep scan -r .rules/SelectItem.yml
4
5useauth_output=$(ast-grep scan -r .rules/useAuth.yml 2>/dev/null)
6
7if [ -z "$useauth_output" ]; then
8    exit 0
9fi
10
11authprovider_output=$(ast-grep scan -r .rules/authProvider.yml 2>/dev/null)
12
13if [ -n "$authprovider_output" ]; then
14    exit 0
15fi
16
17echo "=== ast-grep scan -r .rules/useAuth.yml output ==="
18echo "$useauth_output"
19echo ""
20echo "=== ast-grep scan -r .rules/authProvider.yml output ==="
21echo "$authprovider_output"
22echo ""
23echo "⚠️  Issue detected:"
24echo "The code uses useAuth Hook but does not have AuthProvider component wrapping the components."
25echo "Please ensure that components using useAuth are wrapped with AuthProvider to provide proper authentication context."
26echo ""
27echo "Suggested fixes:"
28echo "1. Add AuthProvider wrapper in app.tsx or corresponding root component"
29echo "2. Ensure all components using useAuth are within AuthProvider scope"
30