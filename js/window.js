(function () {

    var Application = angular.module('Window', []);
    var GlassWindowArea = null;

    /* Posicionamento da Janela */
    function setPosition(node, top, left) {
        node.css({
            position:'absolute',
            top: top + "px",
            left: left + "px"
        });
    }

    /* Tamanho da Janela */
    function setSize(node, width, height) {
        node.css({
            width: width + "px",
            height: height + "px"
        });
    }

    /* Foco na Janela */
    function setFocus(node){
        angular.element(document.querySelectorAll(".wnForm")).css("z-index", "0").removeClass("wnFormShadow");
        node.css("z-index", "100").addClass("wnFormShadow")
    }

    /* Configuração de Estilo visual para o Espelho de Localização */
    var glassX, glassH, glassY, glassW;
    function setVisibilityGlass(visible, x, h, y, w){
        onVisible = visible;
        if (visible){
            GlassWindowArea.style.opacity = 0.2;
            glassX = x; glassY = y; glassH = h; glassW = w;
        }
        else
            GlassWindowArea.style.opacity = 0;
        GlassWindowArea.style.top = y+"px";
        GlassWindowArea.style.height = h+"px";
        GlassWindowArea.style.width = w+"px";
        GlassWindowArea.style.left = x+"px";
    }

    var i = 0;

    /* Diretiva de Formularios */
    Application.directive('window', function(){
        return{
            restrict: "E", // Restrição para Elemento
            templateUrl: "./assets/ui/window.html",
            transclude: true,
            scope: {
                caption : "@",
                width : "@",
                height : "@",
                resizable : "@",
                movable : "@",
                maximized : "@",
                closeable : "@",
                maximizable : "@",
                minimizable : "@"
            },
            link: function(scope, element, attrs){

                // Formulario da Diretiva
                var wnForm = element.children("wnForm");

                if (scope.resizable === undefined) { scope.resizable = false; }  else { scope.resizable = true; }
                if (scope.movable === undefined) { scope.movable = false; }  else { scope.movable = true; }
                if ((scope.minimizable === undefined) || ((scope.minimizable != 'true') && (scope.minimizable != 'false'))) scope.minimizable = true; else scope.minimizable = false;
                if ((scope.maximizable === undefined) || ((scope.maximizable != 'true') && (scope.maximizable != 'false'))) scope.maximizable = true; else scope.maximizable = false;
                if ((scope.closeable === undefined) || ((scope.closeable != 'true') && (scope.closeable != 'false'))) scope.closeable = false; else scope.closeable = true;

                var systembuttons = 0;
                if (scope.minimizable) systembuttons++;
                if (scope.maximizable) systembuttons++;
                if (scope.closeable) systembuttons++;

                // Inicializacao
                setSize(wnForm, scope.width, scope.height);
                setPosition(wnForm, 100, 100);
                setFocus(wnForm);

                // Minimizar a Janela
                scope.minimizeWindow = function() {
                    alert("minimize");
                }

                // Maximizar a Janela
                scope.maximizeWindow = function() {
                    alert("maximize");
                }

                // Remover a Janela
                scope.closeWindow = function() {
                    element.empty();
                }
            }
        }
    });

    /* Diretiva de Localização do Formulário */
    Application.directive('windowArea', function(){
        return{
            restrict: 'E',
            templateUrl: "./assets/ui/window-area.html",
            link: function($scope, $element){
                GlassWindowArea = document.getElementById('wnMovableGlass');
                setVisibilityGlass(false, (window.innerWidth / 3), (100), (window.innerHeight / 3), (100));
            }
        }
    });

    /* Diretiva de Redimensionamento do Formulário */
    Application.directive('resizeable', function($document){
        return {
        }
    });

    /* Diretiva de Movimenetacao de Formularios */
    Application.directive("movable", function($document) {
        return function($scope, $element, $attr) {
            // Formulario da Diretiva
            var wnForm = $element.children("wnForm");

            // Foco no item selecionado
            wnForm.on("mousedown", function($event) {
                $event.preventDefault();
                setFocus(wnForm);
            });

            // Mover janela ao clicar e segurar o mouse na barra de titulo
            wnForm.children("wnFormTitleBar").on("mousedown", function($event) {
                $event.preventDefault();
                startX = $event.pageX - wnForm[0].offsetLeft;
                startY = $event.pageY - wnForm[0].offsetTop;
                onMarginTrigger = 25;
                onVisible = false;

                $document.on("mousemove", mousemove);
                $document.on("mouseup", mouseup);
            });

            // Posicionando a janela ao mover o mouse
            function mousemove($event) {

                if ($attr.resizable != undefined) {
                    var x = wnForm[0].offsetLeft || 0;
                    var h = wnForm[0].offsetHeight || 0;
                    var w = wnForm[0].offsetWidth || 0;
                    var y = wnForm[0].offsetTop || 0;

                    if (x <= onMarginTrigger)
                        setVisibilityGlass(true, 0, (window.innerHeight), 0, (window.innerWidth / 2));
                    else if ((x + w) >= (window.innerWidth - onMarginTrigger))
                        setVisibilityGlass(true, window.innerWidth - (window.innerWidth / 2), (window.innerHeight), 0, (window.innerWidth / 2));
                    else if (y < onMarginTrigger)
                        setVisibilityGlass(true, 0, (window.innerHeight), 0, (window.innerWidth));
                    else if (onVisible)
                        setVisibilityGlass(false, (window.innerWidth / 3), 0, (window.innerHeight / 3), 0);
                }

                setPosition( wnForm , $event.pageY - startY , $event.pageX - startX );
            }

            // Posicionamento da janela ao soltar o mouse
            function mouseup() {
                $document.off("mousemove", mousemove);
                $document.off("mouseup", mouseup);

                if ($attr.resizable != undefined) {
                    if (onVisible) {
                        setVisibilityGlass(false, (window.innerWidth / 3), (100), (window.innerHeight / 3), (100));
                        wnForm.css({
                            position: 'absolute',
                            top: glassY + "px",
                            left: glassX + "px",
                            width: glassW + "px",
                            height: glassH + "px"
                        });
                    } else {
                        wnForm.css({position: 'absolute', width: $attr.width + "px", height: $attr.height + "px"});

                    }
                }
            }
        };
    });

})();