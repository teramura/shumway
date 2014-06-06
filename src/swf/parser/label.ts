/**
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference path='references.ts'/>
module Shumway.SWF.Parser {
  import assert = Shumway.Debug.assert;
  import rgbaObjToCSSStyle = Shumway.ColorUtilities.rgbaObjToCSSStyle;
  var fromCharCode = String.fromCharCode;

  var black = {red: 0, green: 0, blue: 0, alpha: 0};

  export function defineLabel(tag: any, dictionary: any) {
    var records = tag.records;
    var m = tag.matrix;
    var bbox = tag.bbox;

    // expand bbox to match browser text metrices
    //bbox.xMin -= 40;
    //bbox.xMax += 40;
    //bbox.yMin -= 40;
    //bbox.yMax += 40;

    var tx = ((m.tx - bbox.xMin) / 20) | 0;
    var ty = ((m.ty - bbox.yMin) / 20) | 0;
    var cmds = [
      'c.save()',
      'c.transform(' + [m.a, m.b, m.c, m.d, tx, ty].join(',') + ')',
      'c.scale(0.05, 0.05)'
    ];
    var dependencies = [];
    var x = 0;
    var y = 0;
    var i = 0;
    var record;
    var codes;
    var color = black;
    while ((record = records[i++])) {
      if (record.eot)
        break;
      if (record.hasFont) {
        var font = dictionary[record.fontId];
        assert(font, 'undefined font', 'label');
        codes = font.codes;
        cmds.push('c.font="' + record.fontHeight + 'px \'swf-font-' + font.id + '\'"');
        dependencies.push(font.id);
      }

      if (record.hasColor) {
        color = record.color;
      }

      cmds.push('c.fillStyle="' + rgbaObjToCSSStyle(color) + '"');

      if (record.hasMoveX)
        x = record.moveX;
      if (record.hasMoveY)
        y = record.moveY;
      var entries = record.entries;
      var j = 0;
      var entry;
      while ((entry = entries[j++])) {
        var code = codes[entry.glyphIndex];
        assert(code, 'undefined glyph', 'label');
        var text = code >= 32 && code != 34 && code != 92 ? fromCharCode(code) :
                   '\\u' + (code + 0x10000).toString(16).substring(1);
        cmds.push('c.fillText("' + text + '",' + x + ',' + y + ')');
        x += entry.advance;
      }
    }
    cmds.push('c.restore()');
    var label = {
      type: 'label',
      id: tag.id,
      bbox: bbox,
      data: cmds.join('\n'),
      require: null
    };
    if (dependencies.length)
      label.require = dependencies;
    return label;
  }
}