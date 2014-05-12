TMPDIR=fun-js
TMPLIB=fun-js/lib
TARBALL=$(TMPDIR).tar.gz
BROWSERIFY=node_modules/.bin/browserify
TESTLING=node_modules/.bin/testling
NODE=node

.PHONY: node_module test browser-bundle test-bundle testling

MODULES := src/core.js \
           src/http.js

# MODULE_TESTS := test/core-test.js \
#                 test/list-test.js

BROWSER_BUNDLE=bundle.js
TEST_BUNDLE=test.js

# I publish manually using this target
node_module .DEFAULT: $(TARBALL)

$(TARBALL): $(TMPLIB)
	cp $(MODULES) $(TMPLIB) && \
	cp package.json README.md $(TMPDIR) && \
	tar -czf $(TARBALL) $(TMPDIR)

$(TMPLIB):
	mkdir -p $(TMPLIB)

clean:
	-rm -rf $(TMPDIR) $(TMPDIR).tar.gz $(BROWSER_BUNDLE) \
            $(TEST_BUNDLE)

test:
	$(NODE) test/run.js

testling:
	$(TESTLING)

$(TEST_BUNDLE): $(MODULES) $(MODULE_TESTS)
	$(BROWSERIFY) $(MODULES) $(MODULE_TESTS) -o $(TEST_BUNDLE)

browser-bundle: $(BROWSER_BUNDLE)

browser-tests: $(TEST_BUNDLE)
	$(BROWSERIFY) $(MODULES) $(MODULE_TESTS) | $(TESTLING) -u

$(BROWSER_BUNDLE): $(MODULES)
	$(BROWSERIFY) $(MODULES) -o $@
