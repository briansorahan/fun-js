TMPDIR=fun-js
JASMINE_NODE=node_modules/jasmine-node/bin/jasmine-node
BROWSERIFY=node_modules/.bin/browserify

.PHONY: node_module test

MODULE_ROOT=js/fun
MODULES=$(wildcard $(MODULE_ROOT)/*.js)
BROWSER_BUNDLE=bundle.js

# I publish manually using this target
node_module .DEFAULT:
	mkdir $(TMPDIR) && \
	cp js/fun.js package.json README.md $(TMPDIR) && \
	tar -czf $(TMPDIR).tar.gz $(TMPDIR)

clean:
	-rm -rf $(TMPDIR) $(TMPDIR).tar.gz $(BROWSER_BUNDLE)

test:
	@$(JASMINE_NODE) --verbose test

$(BROWSER_BUNDLE): $(MODULES)
	$(BROWSERIFY) $(MODULES) -o $@
