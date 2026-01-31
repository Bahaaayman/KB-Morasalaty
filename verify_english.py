import os

files = ['index-en.html', 'templates-en.html', 'search-results-en.html']
expected_strings = {
    'index-en.html': ['Welcome to Morasalaty Knowledge Base', 'lang="en"'],
    'templates-en.html': ['WhatsApp Templates', 'lang="en"'],
    'search-results-en.html': ['Search Results', 'lang="en"']
}

all_passed = True

for f in files:
    if not os.path.exists(f):
        print(f"FAILED: {f} does not exist")
        all_passed = False
        continue

    with open(f, 'r') as file:
        content = file.read()
        for s in expected_strings[f]:
            if s not in content:
                print(f"FAILED: {f} does not contain '{s}'")
                all_passed = False
            else:
                print(f"PASSED: {f} contains '{s}'")

# Check script.js
with open('js/script.js', 'r') as f:
    content = f.read()
    if 'index-en.html' in content and 'toggleLanguage' in content:
        print("PASSED: js/script.js contains new logic")
    else:
        print("FAILED: js/script.js missing new logic")
        all_passed = False

if all_passed:
    print("ALL CHECKS PASSED")
else:
    exit(1)
