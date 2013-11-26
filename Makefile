# I publish manually using this simple Makefile.
TMPDIR=fun-js

.PHONY: node_module
node_module .DEFAULT:
	mkdir $(TMPDIR) && \
	cp js/fun.js package.json README.md $(TMPDIR) && \
	tar -czf $(TMPDIR).tar.gz $(TMPDIR)

clean:
	-rm -rf $(TMPDIR) $(TMPDIR).tar.gz