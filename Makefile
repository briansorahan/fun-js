# I publish manually using this simple Makefile.
TMPDIR=fun-js
JASMINE_NODE=node_modules/jasmine-node/bin/jasmine-node

.PHONY: node_module test
node_module .DEFAULT:
	mkdir $(TMPDIR) && \
	cp js/fun.js package.json README.md $(TMPDIR) && \
	tar -czf $(TMPDIR).tar.gz $(TMPDIR)

clean:
	-rm -rf $(TMPDIR) $(TMPDIR).tar.gz

test:
	@$(JASMINE_NODE) --verbose tests

