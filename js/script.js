$.ajax({
    url: 'https://www.themealdb.com/api/json/v1/1/list.php?a=list',
    type: 'GET',
    dataType: 'json',
    success: function (list_area) {
        list_area.meals.forEach(element => {
            $("#select_area").append(`<option>${element.strArea}</option>`);
        });
    }
});
let array_meal = [];
$.ajax({
    url: 'https://www.themealdb.com/api/json/v1/1/random.php',
    type: 'GET',
    dataType: 'json',
    success: function (random_meal) {
        console.log(random_meal['meals'][0]['strMeal']);

        $("#btn_Coeur").removeClass('red');
        $("#meal_titre").text(random_meal['meals'][0]['strMeal']);
        $("#ingredients").empty();
        $("#mesure_ingredients").empty();
        if (random_meal['meals'][0]['strMeal'] == localStorage.getItem('love_meal'))
        {
            $("#btn_Coeur").addClass('red');
        }

        let compteur = "1";
        let strIngredient = "strIngredient1";
        let strMesure = "strMeasure1";
        while (random_meal['meals'][0][strIngredient] != "") {
            $("#ingredients").append(`<p>${random_meal['meals'][0][strIngredient]}</p>`);
            $("#mesure_ingredients").append(`<p>${random_meal['meals'][0][strMesure]}</p>`);
            compteur++;
            strIngredient = "strIngredient";
            strIngredient += compteur.toString();
            strMesure = "strMeasure";
            strMesure += compteur.toString();
        }
        $("#meal_image").attr('src',random_meal['meals'][0]['strMealThumb']);
        $("#meal_recette").text(random_meal['meals'][0]['strInstructions']);
        let meal_youtube = random_meal['meals'][0]['strYoutube'];
        meal_youtube = meal_youtube.replace("watch?v=", "embed/");
        $("#meal_youtube").attr('src',meal_youtube);
    }
});









$("#select_area").change(function () {
    array_meal = [];
    $("#select_categories").show();
    GetMealArea();
});

$("#select_categories").change(function(){
    array_meal = [];
    $("#select_ingredient").show();
    GetMeal();
});

$("#btn_Coeur").click(function () {
    $(this).toggleClass("red");
    console.log($("#meal_titre").text());
    localStorage.setItem('love_meal',$("#meal_titre").text());
 });

const GetMealArea = function GetMealIdFromArea() {
    let selected_area = $("#select_area option:selected").text();
    $.ajax({
        url: `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selected_area}`,
        type: 'GET',
        dataType: 'json',
        success: function (p_list_meals_area) {
            $("#select_categories").empty();
            $("#select_categories").append('<option selected="true" disabled="disabled">Choose a category</option>');
            let list_meals = p_list_meals_area;
            list_meals['meals'].forEach(meals => {
                let meal_id = meals['idMeal'];
                $.ajax({
                    url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_id}`,
                    type: 'GET',
                    dataType: 'json',
                    success: function (p_meal) {
                        if($("#select_categories option:contains("+ p_meal['meals'][0]['strCategory'] +")").length)
                        {
                        }
                        else
                        {
                            $("#select_categories").append(`<option>${p_meal['meals'][0]['strCategory']}</option>`);
                        }
                    }
                });
            });
        }
    });
}

const GetMeal = function GetMealFromAreaAndCategory() {
    let selected_category = $("#select_categories option:selected").text();
    let selected_area = $("#select_area option:selected").text();
    $.ajax({
        url: `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selected_area}`,
        type: 'GET',
        dataType: 'json',
        success: function (p_list_meals_area) {
            let list_meals = p_list_meals_area;
            list_meals['meals'].forEach(meals => {
                let meal_id = meals['idMeal'];
                $.ajax({
                    url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_id}`,
                    type: 'GET',
                    dataType: 'json',
                    success: function (p_meal) {
                        if (p_meal['meals'][0]['strCategory'] == selected_category)
                        {
                            array_meal.push(p_meal['meals'][0]);
                        }
                    }
                });
            });
        }
    });
    $("#a_table").show();
}

const showMeal = function ShowTheMeal()
{
    $("#btn_Coeur").removeClass('red');
    let id = Math.floor(Math.random() * array_meal.length);
    $("#meal_titre").text(array_meal[id]['strMeal']);
    $("#ingredients").empty();
    $("#mesure_ingredients").empty();
    if (array_meal[id]['strMeal'] == localStorage.getItem('love_meal'))
    {
        $("#btn_Coeur").addClass('red');
    }
    let compteur = "1";
    let strIngredient = "strIngredient1";
    let strMesure = "strMeasure1";
    while (array_meal[id][strIngredient] != "") {
        $("#ingredients").append(`<p>${array_meal[id][strIngredient]}</p>`);
        $("#mesure_ingredients").append(`<p>${array_meal[id][strMesure]}</p>`);
        compteur++;
        strIngredient = "strIngredient";
        strIngredient += compteur.toString();
        strMesure = "strMeasure";
        strMesure += compteur.toString();
    }
    $("#meal_image").attr('src',array_meal[id]['strMealThumb']);
    $("#meal_recette").text(array_meal[id]['strInstructions']);
    let meal_youtube = array_meal[id]['strYoutube'];
    meal_youtube = meal_youtube.replace("watch?v=", "embed/");
    $("#meal_youtube").attr('src',meal_youtube);
}
