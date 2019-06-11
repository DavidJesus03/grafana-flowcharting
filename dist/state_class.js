"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var State =
/*#__PURE__*/
function () {
  function State(mxcell, xgraph, ctrl) {
    var _this = this;

    _classCallCheck(this, State);

    u.log(1, 'State.constructor()');
    this.mxcell = mxcell;
    this.cellId = mxcell.id;
    this.xgraph = xgraph;
    this.ctrl = ctrl;
    this.templateSrv = this.ctrl.templateSrv;
    this.changed = false;
    this.matched = false;
    this.matchedShape = false;
    this.matchedText = false;
    this.matchedLink = false;
    this.globalLevel = -1;
    this.styles = ['fillColor', 'strokeColor', 'fontColor'];
    this.level = {
      fillColor: -1,
      strokeColor: -1,
      fontColor: -1
    };
    this.tooltips = [];
    this.currentColors = {};
    this.originalColors = {};
    this.originalValue = this.xgraph.getValueCell(mxcell);
    this.currentValue = this.originalValue;
    var link = this.xgraph.getLink(mxcell);
    if (link === undefined) link = null;
    this.originalLink = link;
    this.currentLink = link;
    this.styles.forEach(function (style) {
      var color = _this.xgraph.getStyleCell(mxcell, style);

      _this.currentColors[style] = color;
      _this.originalColors[style] = color;
    });
  }

  _createClass(State, [{
    key: "setState",
    value: function setState(rule, serie) {
      var _this2 = this;

      u.log(1, 'State.setState()');
      u.log(0, 'State.setState() Rule', rule);
      u.log(0, 'State.setState() Serie', serie);

      if (rule.matchSerie(serie)) {
        var shapeMaps = rule.getShapeMaps();
        var textMaps = rule.getTextMaps();
        var linkMaps = rule.getLinkMaps();
        var value = rule.getValueForSerie(serie);
        var FormattedValue = rule.getFormattedValue(value);
        var level = rule.getThresholdLevel(value); // SHAPE

        var cellProp = this.getCellProp(rule.data.shapeProp);
        shapeMaps.forEach(function (shape) {
          if (!shape.isHidden() && shape.match(cellProp)) {
            _this2.matchedShape = true;
            _this2.matched = true;

            if (_this2.globalLevel <= level) {
              _this2.setLevelStyle(rule.data.style, level);

              if (rule.toColorize(value)) {
                _this2.setColorStyle(rule.data.style, rule.getColorForValue(value));
              }

              _this2.overlayIcon = rule.toIconize(value);
            }
          }
        }); // TEXT

        cellProp = this.getCellProp(rule.data.textProp);
        textMaps.forEach(function (text) {
          if (!text.isHidden() && text.match(cellProp)) {
            _this2.matchedText = true;
            _this2.matched = true;

            if (_this2.globalLevel <= level) {
              if (rule.toValorize(value)) {
                var textScoped = _this2.templateSrv.replaceWithText(FormattedValue);

                _this2.setText(rule.getReplaceText(_this2.originalValue, textScoped));
              } else {
                // Hide text
                _this2.setText(rule.getReplaceText(_this2.originalValue, ''));
              }
            }
          }
        }); // LINK

        cellProp = this.getCellProp(rule.data.linkProp);
        linkMaps.forEach(function (link) {
          if (!link.isHidden() && link.match(cellProp)) {
            _this2.matchedLink = true;
            _this2.matched = true;

            if (_this2.globalLevel <= level) {
              if (rule.toLinkable(value)) {
                var linkScoped = _this2.templateSrv.replaceWithText(rule.getLink());

                _this2.currentLink = linkScoped;
              }
            }
          }
        });
      }

      u.log(0, 'State.setState() state', this);
    }
  }, {
    key: "unsetState",
    value: function unsetState() {
      u.log(1, 'State.unsetState()');
      this.unsetLevel();
      this.unsetColor();
      this.unsetText();
      this.unsetLink();
      this.matched = false;
      this.matchedShape = false;
      this.matchedText = false;
      this.matchedLink = false;
      u.log(0, 'State.unsetState() state', this);
    }
  }, {
    key: "isMatched",
    value: function isMatched() {
      return this.matched;
    }
  }, {
    key: "isChanged",
    value: function isChanged() {
      return this.changed;
    }
  }, {
    key: "getCellProp",
    value: function getCellProp(prop) {
      if (prop === 'id') return this.cellId;
      if (prop === 'value') return this.originalValue;
      return '/!\\ Not found';
    }
  }, {
    key: "setColorStyle",
    value: function setColorStyle(style, color) {
      u.log(1, 'State.setColorStyle()');
      this.currentColors[style] = color;
    }
  }, {
    key: "unsetColorStyle",
    value: function unsetColorStyle(style) {
      this.currentColors[style] = this.originalColors[style];
    }
  }, {
    key: "unsetColor",
    value: function unsetColor() {
      var _this3 = this;

      this.styles.forEach(function (style) {
        _this3.unsetColorStyle(style);
      });
    }
  }, {
    key: "getCurrentColorStyle",
    value: function getCurrentColorStyle(style) {
      return this.currentColors[style];
    }
  }, {
    key: "getOriginalColorStyle",
    value: function getOriginalColorStyle(style) {
      return this.originalColors[style];
    }
  }, {
    key: "unsetLevelStyle",
    value: function unsetLevelStyle(style) {
      this.level[style] = -1;
    }
  }, {
    key: "unsetLevel",
    value: function unsetLevel() {
      var _this4 = this;

      this.styles.forEach(function (style) {
        _this4.unsetLevelStyle(style);
      });
      this.globalLevel = -1;
    }
  }, {
    key: "setLevelStyle",
    value: function setLevelStyle(style, level) {
      u.log(1, 'State.setLevelStyle()');
      this.level[style] = level;
      if (this.globalLevel < level) this.globalLevel = level;
    }
  }, {
    key: "getLevelStyle",
    value: function getLevelStyle(style) {
      return this.level[style];
    }
  }, {
    key: "getLevel",
    value: function getLevel() {
      return this.globalLevel;
    }
  }, {
    key: "getTextLevel",
    value: function getTextLevel() {
      var level = this.getLevel();

      switch (level) {
        case -1:
          return 'NO DATA';

        case 0:
          return 'OK';

        case 1:
          return 'WARN';

        case 2:
          return 'ERROR';

        default:
          return 'NULL';
      }
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this.currentValue = text; // this.cell.setValue(text);
    }
  }, {
    key: "getCurrentText",
    value: function getCurrentText() {
      return this.currentValue;
    }
  }, {
    key: "unsetText",
    value: function unsetText() {
      this.currentValue = this.originalValue;
    }
  }, {
    key: "setLink",
    value: function setLink(url) {
      this.currentLink = url;
    }
  }, {
    key: "unsetLink",
    value: function unsetLink() {
      this.currentLink = this.originalLink;
    }
  }, {
    key: "getCurrentLink",
    value: function getCurrentLink() {
      return this.currentLink;
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "isGradient",
    value: function isGradient() {// TODO:
    }
  }, {
    key: "isShape",
    value: function isShape() {
      return this.mxcell.isVertex();
    }
  }, {
    key: "isConnector",
    value: function isConnector() {
      return this.mxcell.isEdge();
    }
  }, {
    key: "applyState",
    value: function applyState() {
      var _this5 = this;

      u.log(1, 'State.applyState()');

      if (this.matched) {
        this.changed = true;

        if (this.matchedShape) {
          this.styles.forEach(function (style) {
            // Apply colors
            _this5.xgraph.setStyleCell(_this5.mxcell, style, _this5.getCurrentColorStyle(style));
          }); // Apply icons

          if (this.overlayIcon) {
            this.xgraph.addOverlay(this.getTextLevel(), this.mxcell);
          } else {
            this.xgraph.removeOverlay(this.mxcell);
          }
        }

        if (this.matchedText) {
          this.xgraph.setValueCell(this.mxcell, this.getCurrentText());
        }

        if (this.matchedLink) {
          this.xgraph.addLink(this.mxcell, this.currentLink);
        }
      } else if (this.changed) this.restoreCell();
    }
  }, {
    key: "restoreCell",
    value: function restoreCell() {
      var _this6 = this;

      this.unsetState();
      this.styles.forEach(function (style) {
        _this6.xgraph.setStyleCell(_this6.mxcell, style, _this6.getCurrentColorStyle(style));
      });
      this.xgraph.setValueCell(this.mxcell, this.getCurrentText()); // this.mxcell.setAttribute('link', this.getCurrentLink());

      this.xgraph.removeOverlay(this.mxcell);
      this.xgraph.addLink(this.mxcell, this.originalLink);
      this.changed = false;
    }
  }, {
    key: "prepare",
    value: function prepare() {
      this.unsetState();
    }
  }]);

  return State;
}();

exports.default = State;
