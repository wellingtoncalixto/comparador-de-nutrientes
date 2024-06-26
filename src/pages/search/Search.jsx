import React from "react";
import style from "./Search.module.css";
import SearchSvg from "../../assets/search.svg?react";
import api from "../../api/Api";
import Select from "react-select";
import TableComponent from "../../components/table/TableComponent";
import HeaderComponent from "../../components/header/HeaderComponent";
import FooterComponent from "../../components/footer/FooterComponent";
import LoadingComponent from "../../components/loading/LoadingComponent";
import LoadingSpinerComponent from "../../components/loadingSpiner/LoadingSpinerComponent";
const Search = () => {
  const [categoriasOptions, setCategoriasOptions] = React.useState([]);
  const [foodsOptions, setFoodsOptions] = React.useState([]);
  const [foodSelected, setFoodSelected] = React.useState();
  const [foodData, setFoodData] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [loadingButton, setLoadingButton] = React.useState(false);

  React.useEffect(() => {
    async function getAllCategories() {
      setLoading(true);
      const { responseObject } = await api.getAllCategories();
      const categorias = responseObject.data.data.getAllCategories;
      const map = categorias.map((categoria) => {
        return {
          value: categoria.id,
          label: categoria.name,
        };
      });
      setCategoriasOptions(map);
      setLoading(false);
    }
    getAllCategories();
  }, []);

  async function getFoodByCategory(categoriId) {
    const { responseObject } = await api.getFoodListByCategoryId(categoriId);
    const foods = responseObject.data.data.getCategoryById.foods;

    const map = foods.map((categoria) => {
      return {
        value: categoria.id,
        label: categoria.name,
      };
    });

    setFoodsOptions(map);
  }

  function handleChangeCategoria(choice) {
    getFoodByCategory(choice.value);
  }
  function handleChangeFood(choice) {
    setFoodSelected(choice.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoadingButton(true);
    const { responseObject } = await api.getFoodDataById(foodSelected);
    const foodData = responseObject.data.data.getFoodById;
    setFoodData(foodData);
    setLoadingButton(false);
  }

  if (loading) return <LoadingComponent />;
  return (
    <>
      <HeaderComponent />
      <section className={style.searchSection}>
        <SearchSvg className={style.searchSvg} />
        <h2 className={`${style.searchSubTitle} heading-3`}>
          Encontre os dados nutricionais dos alimentos para auxiliar na sua
          dieta.
        </h2>
        <form className={style.searchForm} onSubmit={(e) => handleSubmit(e)}>
          <div
            className={`${style.searchSelectContainer} ${style.searchSelectCategoria}`}
          >
            <label
              htmlFor="categoriaSelect"
              className={`${style.searchSelectLabel} label-1`}
            >
              Categorias
            </label>
            <Select
              id="categoriaSelect"
              name="categoriaSelect"
              placeholder="Selecione uma categoria"
              options={categoriasOptions}
              onChange={(choice) => handleChangeCategoria(choice)}
            />
          </div>
          <div
            className={`${style.searchSelectContainer} ${style.searchSelectFood}`}
          >
            <label
              htmlFor="foodSelect"
              className={`${style.searchSelectLabel} label-1`}
            >{`Food's`}</label>
            <Select
              id="foodSelect"
              name="foodSelect"
              options={foodsOptions}
              placeholder="Selecione uma comida"
              onChange={(choice) => handleChangeFood(choice)}
              isDisabled={foodsOptions.length === 0 ? true : false}
            />
          </div>
          <button
            className={`${style.searchFormButton} cta-medium`}
            type="submit"
            disabled={!foodSelected || loadingButton ? true : false}
          >
            {loadingButton ? (
              <LoadingSpinerComponent width={25} heigth={25} />
            ) : (
              "Pesquisar"
            )}
          </button>
        </form>
        {foodData && (
          <>
            <span className={style.searchDiviser}></span>
            <div className={style.searchResultContainer}>
              <TableComponent data={foodData} />
              <p className={`${style.resultMessage} label-1`}>
                Obs: Todos os dados são referente a quarta edição da tabela TACO
                (Tabela Brasileira de Composição de Alimentos)
              </p>
            </div>
          </>
        )}
      </section>
      <FooterComponent />
    </>
  );
};

export default Search;
