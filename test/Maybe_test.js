/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
module.exports.run = function(test) {
    var fun           = require("../src")
      , util          = require("./util")
      , isa           = fun.isa
      , Functor       = fun.Functor
      , Just          = fun.Just
      , Nothing       = fun.Nothing
      , Iface         = fun.Iface
      , fromMaybe     = fun.fromMaybe
    ;

    test("is a Functor", function(t) {
        t.plan(2);

        t.ok(isa(Functor, Nothing),
             "Nothing is a Functor");

        t.ok(isa(Functor, Just(1)),
             "Just(1) is a Functor");
    });

    test("is a Monad", function(t) {
        t.plan(4);

        /*
         * see http://www.haskell.org/haskellwiki/All_About_Monads
         * for the sheep example this is based on
         * each Sheep is possible a clone, so this is why father and
         * mother return Maybe Sheep instead of Sheep
         */

        // type Sheep
        //     where father :: Sheep -> Maybe Sheep
        //           mother :: Sheep -> Maybe Sheep
        var Sheep = Iface.parse("father mother");
        // Clone type constructor
        Sheep.Clone = function() {
            return Sheep.instance({
                father:    function() { return Nothing; },
                mother:    function() { return Nothing; }
            });
        };
        // Natural type constructor
        Sheep.Natural = function(mother, father) {
            return Sheep.instance({
                father: function() { return Just(father); },
                mother: function() { return Just(mother); }
            });
        };
        // father :: Sheep -> Maybe Sheep
        var father = function(s) { return s.father(); };
        // mother :: Sheep -> Maybe Sheep
        var mother = function(s) { return s.mother(); };
        // maternalGrandfather :: Sheep -> Maybe Sheep
        // version 1
        var maternalGrandfather1 = function(s) {
            var m = mother(s);
            return m.isNothing() ? Nothing : father(m);
        };
        // mothersPaternalGrandfather :: Sheep -> Maybe Sheep
        // version 1
        var mothersPaternalGrandfather1 = function(s) {
            var m = mother(s);

            if (m.isNothing()) {
                return Nothing;
            } else {
                var gf = father(fromMaybe(undefined, m));

                if (gf.isNothing()) {
                    return Nothing;
                } else {
                    return father(fromMaybe(undefined, gf));
                }
            }
        };
        //
        // a family tree descended from clones where S is the child
        //
        //                                         S
        //                                         |
        //                 ------------------------------------------------
        //                 |                                              |
        //                M S                                            F S
        //                 |                                              |
        //          ---------------------                     -------------------------
        //          |                   |                     |                       |
        //        M M S               F M S                 M F S                   F F S
        //          |                   |                     |                       |
        //     -----------          ----------            ----------             -----------
        //     |         |          |        |            |        |             |         |
        //  M M M S   F M M S    M F M S  F F M S      M M F S  F M F S       M F F S   F F F S
        //
        var MMMS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
        var FMMS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
        var MFMS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
        var FFMS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
        var MMFS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
        var FMFS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
        var MFFS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
        var FFFS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());

        var MMS  = Sheep.Natural(MMMS, FMMS);
        var FMS  = Sheep.Natural(MFMS, FFMS);
        var MFS  = Sheep.Natural(MMFS, FMFS);
        var FFS  = Sheep.Natural(MFFS, FFFS);

        var MS   = Sheep.Natural(MMS, FMS);
        var FS   = Sheep.Natural(FMS, FFS);

        var S    = Sheep.Natural(MS, FS);

        // expectSheep :: Sheep -> Maybe Sheep -> Boolean
        function expectSheep(sheep, maybe) {
            if (maybe === Nothing) {
                t.ok(false);
                return Nothing;
            } else {
                return maybe.bind(function(s) {
                    t.equal(s, sheep);
                    return Just(s);
                });
            }
        }

        expectSheep(MS,    mother(S));
        expectSheep(FFMS,  mothersPaternalGrandfather1(S));

        // maternalGrandfather :: Sheep -> Maybe Sheep
        // version 2
        var maternalGrandfather2 = function(s) {
            return Just(s).bind(mother).bind(father);
        };

        // mothersPaternalGrandfather :: Sheep -> Maybe Sheep
        // version 2
        // way better!!
        var mothersPaternalGrandfather2 = function(s) {
            return Just(s).bind(mother).bind(father).bind(father);
        };

        expectSheep(FMS,   maternalGrandfather2(S));
        expectSheep(FFMS,  mothersPaternalGrandfather2(S));
    });
};
