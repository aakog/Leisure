{
  resolve,
  lazy,
} = root = module.exports = require '15-base'

{
  define,
} = require '16-ast'

rz = resolve
lz = lazy

BS = 8
ENTER = 13
DEL = 46
TAB = 9
LEFT = 37
UP = 38
RIGHT = 39
DOWN = 40
HOME = 36
END = 35

textNode = (text)-> document.createTextNode(text)

getSvgElement = (id)->
  if (el = document.getElementById id) then el
  else
    svg = createNode "<svg id='HIDDEN_SVG' xmlns='http://www.w3.org/2000/svg' version='1.1' style='top: -100000px; position: absolute'><text id='HIDDEN_TEXT'>bubba</text></svg>"
    document.body.appendChild(svg)
    document.getElementById id

svgMeasureText = (text, style, f, more)->
  if Leisure_shouldDispatch(f, more) then return Leisure.dispatch arguments
  txt = getSvgElement('HIDDEN_TEXT')
  if rz style then txt.setAttribute 'style', rz style
  txt.lastChild.textContent = rz text
  bx = txt.getBBox()
  rz(f)(lz bx.width)(lz bx.height)

transformedPoint = (pt, x, y, ctm, ictm)->
  pt.x = x
  pt.y = y
  pt.matrixTransform(ctm).matrixTransform(ictm)

# try to take strokeWidth into account
svgMeasure = (content)-> primSvgMeasure content, baseStrokeWidth

# try to take strokeWidth into account
svgBetterMeasure = (content)-> primSvgMeasure content, transformStrokeWidth

# try to take strokeWidth into account
primSvgMeasure = (content, transformFunc)->(f)->
  svg = createNode "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' style='top: -100000'><g>#{content}</g></svg>"
  document.body.appendChild(svg)
  g = svg.firstChild
  bbox = g.getBBox()
  pad = getMaxStrokeWidth g, g, svg, transformFunc
  document.body.removeChild(svg)
  rz(f)(lz bbox.x - Math.ceil(pad/2))(lz bbox.y - Math.ceil(pad/2))(lz bbox.width + pad)(lz bbox.height + pad)

baseElements = ['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon']

foldLeft = (func, val, thing)->
  if thing instanceof Leisure_cons then thing.foldl func, val
  else primFoldLeft func, val, thing, 0

primFoldLeft = (func, val, array, index)->
  if index < array.length then primFoldLeft func, func(val, array[index]), array, index + 1
  else val

getMaxStrokeWidth = (el, base, svg, transformFunc)->
  if base.nodeName in baseElements
    #hack to parse strokeWidth string by setting the width of the svg to it
    svg.setAttribute 'width', (getComputedStyle(base).strokeWidth ? '0'), svg
    transformFunc el, svg.width.baseVal.value
  else if base.nodeName == 'use' then getMaxStrokeWidth base, base.instanceRoot.correspondingElement, svg, transformFunc
  else if base.nodeName == 'g'
    foldLeft ((v, n)-> Math.max v, (getMaxStrokeWidth n, n, svg, transformFunc)), 0, el.childNodes
  else 0

baseStrokeWidth = (el, w)-> w

transformStrokeWidth = (el, w)->
  if w == 0 then 0
  else
    ctm = el.getScreenCTM()
    tp1 = transformedPoint pt, bx.x - Math.ceil(w), bx.y - Math.ceil(w), ctm, isctm
    tp2 = transformedPoint pt, bx.x + bx.width + Math.ceil(w), bx.y + bx.height + Math.ceil(w), ctm, isctm
    x = tp2.x - tp1.x
    y = tp2.y - tp1.y
    Math.sqrt(x * x + y * y)

createNode = (txt)->
  scratch = document.createElement 'DIV'
  scratch.innerHTML = txt
  scratch.firstChild

define 'svgMeasure', (lz (content)->svgMeasure(rz content)), 1

define 'svgMeasureText', (lz (text)->svgMeasureText(rz text)), 1

root.svgMeasure = svgMeasure
root.svgMeasureText = svgMeasureText
root.createNode = createNode
root.ENTER = ENTER
root.BS = BS
root.DEL = DEL
root.TAB = TAB
root.LEFT = LEFT
root.UP = UP
root.RIGHT = RIGHT
root.DOWN = DOWN
root.HOME = HOME
root.END = END
root.textNode = textNode
