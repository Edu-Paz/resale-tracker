import { useState } from "react";
import { ApiError, createCategory } from "../services/api";
import { getToken } from "../services/session";

function getFormErrorMessage(error) {
    if (error instanceof ApiError) return error.message;
    return "Não foi possível concluir a operação. Tente novamente.";
}

function CategoryForm({ categories, onCategoryCreated }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) return;

        const form = event.currentTarget;
        setIsSubmitting(true);
        setFormMessage(null);

        try {
            const category = await createCategory(getToken(), {
                name: new FormData(form).get("name").trim(),
            });
            onCategoryCreated(category);
            setFormMessage({
                type: "success",
                text: "Categoria criada com sucesso.",
            });
            form.reset();
        } catch (error) {
            if (error instanceof ApiError && error.status === 422) {
                setFormMessage({
                    type: "error",
                    text: "Já existe uma categoria com esse nome.",
                });
            } else {
                setFormMessage({
                    type: "error",
                    text: getFormErrorMessage(error),
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section
            className="dashboard-panel form-panel"
            aria-labelledby="new-category-title">
            <div className="panel-heading">
                <div>
                    <p className="eyebrow">Organização</p>
                    <h2 id="new-category-title">Criar categoria</h2>
                </div>
                <span className="panel-count">{categories.length}</span>
            </div>
            <form
                className="dashboard-form category-form"
                onSubmit={handleSubmit}>
                <label>
                    Nome da categoria
                    <input
                        name="name"
                        placeholder="Ex.: Eletrônicos"
                        required
                    />
                </label>
                {formMessage && (
                    <p
                        className={`form-message form-${formMessage.type}`}
                        role={
                            formMessage.type === "error" ? "alert" : "status"
                        }>
                        {formMessage.text}
                    </p>
                )}
                <button
                    className="cta-button"
                    type="submit"
                    disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Criar categoria"}
                </button>
            </form>
            <div className="category-list">
                {categories.map((category) => (
                    <span key={category.id}>{category.name}</span>
                ))}
            </div>
        </section>
    );
}

export default CategoryForm;
